import { get, writable, type Readable } from 'svelte/store';
import { createAutoSubmitter, type AutoSubmitConfig } from '$lib/onchain/auto-submit';
import { epochInfo, localComputer, time, timeConfig } from '$lib/time';
import {
	connection,
	publicClient,
	signer,
	type OptionalSigner,
	type Signer
} from '$lib/connection';
import { writes } from '$lib/onchain/writes';
import { keccak256 } from 'viem';
import deployments from '$lib/deployments';
import { privateKeyToAccount } from 'viem/accounts';
import type { Position } from 'reveal-or-die-contracts';
import { logs } from 'named-logs';

const console = logs('localState');

export type LocalAction = {
	type: 'move' | 'exit' | 'enter';
	x: number;
	y: number;
};

export type LocalAvatar = {
	actions: LocalAction[];
	submission?: {
		commit: {
			secret: `0x${string}`;
			epoch: number;
			txHash: string;
			actions: LocalAction[];
			includedInBlock?: number;
		};
		reveal?: {
			epoch: number;
			txHash: string;
			includedInBlock?: number;
		};
	};
	epoch: number;
	avatarID: string;
	exiting: boolean;
};

export type LocalSignedInState = {
	signer: Signer;
	avatar?: LocalAvatar;
	tutorialSeen: boolean;
};
export type LocalReadyState = {
	signer: Signer;
	avatar: LocalAvatar;
	tutorialSeen: boolean;
};
export type LocalState = { signer: undefined } | LocalSignedInState | LocalReadyState;

function defaultState() {
	return {
		signer: undefined
	};
}
const $state: LocalState = defaultState();

function LOCAL_STORAGE_STATE_KEY(signerAddress: `0x${string}`) {
	return `__private__${deployments.chain.id}_${deployments.chain.genesisHash}_${deployments.contracts.Game.address}_${signerAddress}`;
}

export function computeUpdatedLocalState($state: LocalState, epoch: number): LocalState {
	if (!$state.signer) {
		return $state;
	}
	if (!$state.avatar) {
		return $state;
	}
	if (epoch > $state.avatar.epoch) {
		return {
			...$state,
			avatar: {
				avatarID: $state.avatar.avatarID,
				actions: [],
				epoch,
				submission: undefined,
				exiting: $state.avatar.exiting
			}
		};
	}
	return $state;
}

export function createLocalState(signer: Readable<OptionalSigner>) {
	const _localState = writable<LocalState>($state, start);

	function set(state: LocalState) {
		if ($state != state) {
			const keys = Object.keys(state).concat(Object.keys($state));
			for (const key of keys) {
				($state as any)[key] = (state as any)[key];
			}
		}

		if ($state.signer) {
			try {
				localStorage.setItem(LOCAL_STORAGE_STATE_KEY($state.signer.owner), JSON.stringify($state));
			} catch (err) {
				console.error(`failed to write to local storage`, err);
			}
		}
		_localState.set($state);
		return $state;
	}

	function start() {
		const unsubscribeFromOptionalSigner = signer.subscribe(($signer) => {
			if ($signer?.owner !== $state.signer?.owner) {
				if ($signer) {
					try {
						const fromStorageStr = localStorage.getItem(LOCAL_STORAGE_STATE_KEY($signer.owner));
						if (fromStorageStr) {
							const fromStorage = JSON.parse(fromStorageStr);
							set(fromStorage);
						} else {
							set({ signer: $signer, tutorialSeen: false });
						}
					} catch (err) {
						set({ signer: $signer, tutorialSeen: false });
					}
				} else {
					set({ signer: undefined });
				}
			}
		});
		return unsubscribeFromOptionalSigner;
	}

	function markTutorialAsSeen() {
		if (!$state.signer) {
			return;
		}
		$state.tutorialSeen = true;
		set($state);
	}

	function markTutorialAsUnSeen() {
		if (!$state.signer) {
			return;
		}
		$state.tutorialSeen = false;
		set($state);
	}

	function reset() {
		if (!$state.signer) {
			return;
		}
		if (!$state.avatar) {
			return;
		}
		console.log(`reseting actions`);
		$state.avatar = {
			avatarID: $state.avatar.avatarID,
			actions: [],
			epoch: $state.avatar.epoch,
			submission: undefined,
			exiting: $state.avatar.exiting
		};
	}

	function updateLocalState(epoch: number) {
		const newState = computeUpdatedLocalState($state, epoch);
		const keys = Object.keys(newState).concat(Object.keys($state));
		for (const key of keys) {
			($state as any)[key] = (newState as any)[key];
		}
	}

	let commiting = false;
	let revealing = false;
	return {
		get value() {
			return $state;
		},
		subscribe: _localState.subscribe,
		markTutorialAsSeen,
		markTutorialAsUnSeen,
		addAction(epoch: number, action: LocalAction) {
			updateLocalState(epoch);

			if (!$state.signer) {
				throw new Error(`no signer`);
			}

			if (!$state.avatar) {
				throw new Error(`no avatar`);
			}

			if ($state.avatar.submission) {
				throw new Error(`submission in progress`);
			}

			if ($state.avatar.actions[0]?.type === 'enter') {
				return;
			}

			$state.avatar.actions.push(action);
			set($state);
		},
		update(epoch: number) {
			const previousEpoch = $state.signer && $state.avatar ? $state.avatar.epoch : 0;
			updateLocalState(epoch);
			set($state);
			const newEpoch = $state.signer && $state.avatar ? $state.avatar.epoch : 0;
			if (previousEpoch !== newEpoch) {
				console.log(`new epoch`);
			}
		},
		reset,
		enter(avatarID: bigint, epoch: number, position: Position) {
			if (!$state.signer) {
				throw new Error(`no signer`);
			}

			updateLocalState(epoch);

			// TODO should we still check here to avoid overriding by mistake ?
			// if ($state.avatar && $state.avatar.avatarID != avatarID.toString()) {
			// 	throw new Error(`got an avatar already`);
			// }

			console.log(`enterring at epoch: ${epoch}`);
			const actions: LocalAction[] = [{ type: 'enter', x: position.x, y: position.y }];

			// console.log(`avatars`, avatarID);

			$state.avatar = {
				avatarID: avatarID.toString(),
				actions,
				epoch,
				exiting: false
			};

			set($state);
		},

		async commit(options?: { pollingInterval?: number }) {
			if (commiting) {
				console.log(`already commiting...`);
				return;
			}

			if (!$state.signer) {
				throw new Error(`no signer`);
			}

			if (!$state.avatar) {
				throw new Error(`no avatar`);
			}

			const $epochInfo = epochInfo.now();
			const { currentEpoch: epoch } = $epochInfo;

			if ($state.avatar.epoch > epoch) {
				console.log(`not in yet`);
				return;
			}

			updateLocalState(epoch);

			console.log(`commiting for epoch ${epoch}...`);

			try {
				commiting = true;

				const actions = [...$state.avatar.actions];

				const account = privateKeyToAccount($state.signer.privateKey);
				const secretSig = await account.signMessage({
					message: `Commit:${deployments.chain.id}:${deployments.contracts.Game.address}:${epoch}`
				});
				const secret = keccak256(secretSig);
				const { transactionID, wait } = await writes.commit_actions(
					BigInt($state.avatar.avatarID),
					secret,
					actions,
					options
				);

				$state.avatar.submission = {
					commit: {
						epoch,
						secret,
						txHash: transactionID,
						actions
					}
				};
				$state.avatar.exiting = !!actions.find((action) => action.type === 'exit');
				set($state);

				console.log(`waiting for commit tx...`);

				const receipt = await wait();
				console.log(`... commit receipt received!`);
				if (receipt.status === 'reverted') {
					console.error(`commit reverted`, receipt);
					$state.avatar.submission = undefined;
					set($state);
				} else {
					if ($state.avatar.submission.commit) {
						$state.avatar.submission.commit.includedInBlock = Number(receipt.blockNumber)
						set($state);
					} else {
						console.error(`commit data has disapeared!`)
					}
				}
			} catch (err) {
				$state.avatar.submission = undefined;
				set($state);
				console.error(err);
			} finally {
				commiting = false;
			}
		},

		rewind(epoch: number) {
			if (!$state.signer) {
				throw new Error(`no signer`);
			}

			if (!$state.avatar) {
				throw new Error(`no avatar`);
			}

			updateLocalState(epoch);

			if ($state.avatar.actions.length > 0) {
				if ($state.avatar.actions[$state.avatar.actions.length - 1].type !== 'enter') {
					const lastAction = $state.avatar.actions.pop();
					// if (lastAction?.type === 'exit') {
					// TODO auto cancel the move too ?
					// need to handle case where there i s no move
					// }
				}
			}
			set($state);
		},

		removeAvatar() {
			if (!$state.signer) {
				throw new Error(`no signer`);
			}

			if (!$state.avatar) {
				throw new Error(`no avatar`);
			}
			$state.avatar = undefined;
			set($state);
		},

		async reveal(options?: { pollingInterval?: number }) {
			if (revealing) {
				console.log(`already revealing...`);
				return;
			}

			if (!$state.signer) {
				throw new Error(`no signer`);
			}

			if (!$state.avatar) {
				throw new Error(`no avatar`);
			}

			const $epochInfo = epochInfo.now();
			const { currentEpoch: epoch } = $epochInfo;

			updateLocalState(epoch);

			if (!$state.avatar.submission) {
				set($state);
				return;
			}

			console.log(`revealing for epoch ${epoch}...`);

			const commitment = $state.avatar.submission.commit;
			if (!commitment) {
				throw new Error(`cannot reveal without commitment info`);
			}

			try {
				revealing = true;

				// const block = await time.fetchBlockTime();
				// const epochAccordingToBlockTime = localComputer.calculateEpochInfo(block.blockTime);

				// if (epochAccordingToBlockTime.isCommitPhase) {
				// 	throw new Error(`time is not valid`);
				// }

				const { transactionID, wait } = await writes.reveal_actions(
					BigInt($state.avatar.avatarID),
					commitment.secret,
					commitment.actions,
					options
				);

				$state.avatar.submission = {
					commit: commitment,
					reveal: {
						epoch,
						txHash: transactionID
					}
				};
				set($state);

				console.log(`waiting for reveal tx...`);

				const receipt = await wait();
				console.log(`... reveal receipt received!`);
				if (receipt.status === 'reverted') {
					console.error(`reveal reverted`, receipt);
					$state.avatar.submission.reveal = undefined;
					set($state);
				} else {
					if ($state.avatar.submission.reveal) {
						$state.avatar.submission.reveal.includedInBlock = Number(receipt.blockNumber)
						set($state);
					} else {
						console.error(`reveal data has disapeared!`)
					}
				}

			} catch (err) {
				if ($state.avatar.submission) {
					$state.avatar.submission.reveal = undefined;
				}
				set($state);
				console.error(err);
			} finally {
				revealing = false;
			}
		}
	};
}

export const localState = createLocalState(signer);

const highFrequencyInterval = (timeConfig.REVEAL_PHASE_DURATION * 1000) / 30;

// Commit auto-submitter configuration
const commitConfig: AutoSubmitConfig = {
	execute: () => {
		localState.commit({ pollingInterval: highFrequencyInterval });
	},
	shouldExecute: ({ currentEpochInfo }) => {

		const currentLocalData = computeUpdatedLocalState(
			localState.value,
			currentEpochInfo.currentEpoch
		);

		if (!currentLocalData.signer || !currentLocalData.avatar) {
			return false;
		}

		return (
			currentEpochInfo.isCommitPhase &&
			!currentLocalData.avatar.submission &&
			!(currentLocalData.avatar.exiting && currentLocalData.avatar.actions.length == 0) &&
			currentLocalData.avatar.epoch == currentEpochInfo.currentEpoch
		);
	},
	getTiming: ({ currentEpochInfo }) => {
		const currentLocalData = computeUpdatedLocalState(
			localState.value,
			currentEpochInfo.currentEpoch
		);
		if (!currentLocalData.signer || !currentLocalData.avatar) {
			return { shouldStart: false, delayMs: 0, highFrequencyInterval };
		}

		// For commit: check if we need to start high-frequency checking 1 second before commit time
		const timeToCommit = currentEpochInfo.timeLeftForCommitEnd - timeConfig.COMMIT_TIME_ALLOWANCE;

		const shouldStartCommitCheck =
			currentEpochInfo.isCommitPhase &&
			!currentLocalData.avatar.submission &&
			currentLocalData.avatar.epoch == currentEpochInfo.currentEpoch &&
			timeToCommit <= 1.0; // Within 1 second of commit time

		return {
			shouldStart: shouldStartCommitCheck,
			delayMs: shouldStartCommitCheck ? Math.max(0, (timeToCommit + 0.1) * 1000) : 0,
			highFrequencyInterval
		};
	}
};

export const commitAutoSubmitter = createAutoSubmitter(commitConfig);
commitAutoSubmitter.start();

// Reveal auto-submitter configuration
const revealConfig: AutoSubmitConfig = {
	execute: () => {
		localState.reveal({ pollingInterval: highFrequencyInterval });
	},
	shouldExecute: ({ currentEpochInfo }) => {
		const currentLocalData = computeUpdatedLocalState(
			localState.value,
			currentEpochInfo.currentEpoch
		);
		if (!currentLocalData.signer || !currentLocalData.avatar) {
			return false;
		}


		if (!currentEpochInfo.isCommitPhase) {

			// TODO ?
			// if (!currentLocalData.avatar.submission.commit.includedInBlock) {
			// 	const receipt = await publicClient.getTransactionReceipt({ hash: currentLocalData.avatar.submission.commit.txHash as `0x${string}` });

			// }

			if (
				currentLocalData.avatar.submission &&
				currentLocalData.avatar.submission.commit.epoch == currentEpochInfo.currentEpoch
				&& currentLocalData.avatar.submission.commit.includedInBlock
			) {


				if (
					!currentLocalData.avatar.submission.reveal ||
					currentLocalData.avatar.submission.reveal.epoch < currentEpochInfo.currentEpoch
				) {

					return true;
				} else {
					console.log(`already reveal, retrying`)
					// try resubmission 
					return true;
				}
			} else {
				console.log(`no commit found`)
				// Handle avatar removal if commit was not performed
				if (
					currentLocalData.avatar.epoch == currentEpochInfo.currentEpoch &&
					currentLocalData.avatar.actions.length > 0 &&
					currentLocalData.avatar.actions[currentLocalData.avatar.actions.length - 1].type ==
					'enter'
				) {
					console.log(`deleting avatar...`)
					localState.removeAvatar();
				}
				// Stop checking if conditions no longer met

				return false;
			}
		} else {
			console.log(`not in reveal phase anymore`)
			// Stop checking if not in reveal phase anymore
			return false;
		}
	},
	getTiming: ({ currentEpochInfo }) => {
		const currentLocalData = computeUpdatedLocalState(
			localState.value,
			currentEpochInfo.currentEpoch
		);
		if (!currentLocalData.signer || !currentLocalData.avatar) {
			return { shouldStart: false, delayMs: 0, highFrequencyInterval };
		}



		// For reveal: check if we need to start high-frequency checking 1 second before reveal time
		const shouldStartRevealCheck =
			(!currentLocalData.avatar.submission?.reveal ||
				currentLocalData.avatar.submission.reveal.epoch < currentEpochInfo.currentEpoch) &&
			(!currentEpochInfo.isCommitPhase || currentEpochInfo.timeLeftForCommitEnd <= 1.0); // Within 1 second of reveal time

		return {
			shouldStart: shouldStartRevealCheck,
			delayMs: shouldStartRevealCheck
				? currentEpochInfo.isCommitPhase
					? (currentEpochInfo.timeLeftForCommitEnd + 0.1) * 1000
					: 100
				: 0,
			highFrequencyInterval
		};
	}
};

export const revealAutoSubmitter = createAutoSubmitter(revealConfig);
revealAutoSubmitter.start();

(globalThis as any).commitAutoSubmitter = commitAutoSubmitter;
(globalThis as any).revealAutoSubmitter = revealAutoSubmitter;
(globalThis as any).localState = localState;
