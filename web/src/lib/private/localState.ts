import type {Position} from 'reveal-or-die-contracts';
import {logs} from 'named-logs';
import {get, writable, type Readable} from 'svelte/store';
import {keccak256, parseEventLogs} from 'viem';
import {privateKeyToAccount} from 'viem/accounts';
import type {WriteOperations} from '$lib/onchain/writes';
import type {EpochInfoStore} from '$lib/types';
import type {
	OptionalSigner,
	Signer,
	TypedDeployments,
} from '$lib/core/connection/types';

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
export type LocalState =
	| {signer: undefined}
	| LocalSignedInState
	| LocalReadyState;

function defaultState() {
	return {
		signer: undefined,
	};
}
const $state: LocalState = defaultState();

export function computeUpdatedLocalState(
	$state: LocalState,
	epoch: number,
): LocalState {
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
				exiting: $state.avatar.exiting,
			},
		};
	}
	return $state;
}

export function createLocalState(params: {
	signer: Readable<OptionalSigner>;
	epochInfo: EpochInfoStore;
	deployments: TypedDeployments;
	writes: WriteOperations;
}) {
	const {signer, epochInfo, deployments, writes} = params;
	function LOCAL_STORAGE_STATE_KEY(signerAddress: `0x${string}`) {
		return `__private__${deployments.chain.id}_${deployments.chain.genesisHash}_${deployments.contracts.Game.address}_${signerAddress}`;
	}

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
				localStorage.setItem(
					LOCAL_STORAGE_STATE_KEY($state.signer.owner),
					JSON.stringify($state),
				);
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
						const fromStorageStr = localStorage.getItem(
							LOCAL_STORAGE_STATE_KEY($signer.owner),
						);
						if (fromStorageStr) {
							const fromStorage = JSON.parse(fromStorageStr);
							set(fromStorage);
						} else {
							set({signer: $signer, tutorialSeen: false});
						}
					} catch (err) {
						set({signer: $signer, tutorialSeen: false});
					}
				} else {
					set({signer: undefined});
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
			exiting: $state.avatar.exiting,
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
			const previousEpoch =
				$state.signer && $state.avatar ? $state.avatar.epoch : 0;
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
			const actions: LocalAction[] = [
				{type: 'enter', x: position.x, y: position.y},
			];

			// console.log(`avatars`, avatarID);

			$state.avatar = {
				avatarID: avatarID.toString(),
				actions,
				epoch,
				exiting: false,
			};

			set($state);
		},

		async commit(options?: {pollingInterval?: number}) {
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
			const {currentEpoch: epoch} = $epochInfo;

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
					message: `Commit:${deployments.chain.id}:${deployments.contracts.Game.address}:${epoch}`,
				});
				const secret = keccak256(secretSig);
				const {transactionID, wait} = await writes.commit_actions(
					BigInt($state.avatar.avatarID),
					secret,
					actions,
					options,
				);

				$state.avatar.submission = {
					commit: {
						epoch,
						secret,
						txHash: transactionID,
						actions,
					},
				};
				$state.avatar.exiting = !!actions.find(
					(action) => action.type === 'exit',
				);
				set($state);

				console.log(`waiting for commit tx...`);

				const receipt = await wait();
				console.log(`... commit receipt received!`);
				if (receipt.status === 'reverted') {
					throw new Error('commit revered', {cause: receipt});
				} else {
					if ($state.avatar.submission.commit) {
						$state.avatar.submission.commit.includedInBlock = Number(
							receipt.blockNumber,
						);
						set($state);
					} else {
						console.error(`commit data has disapeared!`);
					}
				}
			} catch (err) {
				$state.avatar.submission = undefined;
				set($state);
				console.error(err);
				throw err;
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
				if (
					$state.avatar.actions[$state.avatar.actions.length - 1].type !==
					'enter'
				) {
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

		async reveal(options?: {pollingInterval?: number}) {
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
			const {currentEpoch: epoch} = $epochInfo;

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

				const {transactionID, wait} = await writes.reveal_actions(
					BigInt($state.avatar.avatarID),
					commitment.secret,
					commitment.actions,
					options,
				);

				$state.avatar.submission = {
					commit: commitment,
					reveal: {
						epoch,
						txHash: transactionID,
					},
				};
				set($state);

				console.log(`waiting for reveal tx...`);

				const receipt = await wait();
				if (receipt.logs) {
					const parsedLogs = parseEventLogs({
						abi: deployments.contracts.Game.abi,
						logs: receipt.logs,
					});
					let errorsFound: any[] = [];
					for (const log of parsedLogs) {
						if (log.eventName === 'Error') {
							errorsFound.push(log);
						}
					}
					if (errorsFound.length > 0) {
						throw new Error('reveal error', {cause: errorsFound});
					}
				}
				console.log(`... reveal receipt received!`);
				if (receipt.status === 'reverted') {
					throw new Error('reveal reverted', {cause: receipt});
				} else {
					if ($state.avatar.submission.reveal) {
						$state.avatar.submission.reveal.includedInBlock = Number(
							receipt.blockNumber,
						);
						set($state);
					} else {
						console.error(`reveal data has disapeared!`);
					}
				}
			} catch (err: any) {
				if ($state.avatar.submission) {
					$state.avatar.submission.reveal = undefined;
				}
				set($state);
				console.error(err, err.cause);
				throw err;
			} finally {
				revealing = false;
			}
		},
	};
}

export type LocalStateStore = ReturnType<typeof createLocalState>;
