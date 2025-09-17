import { get, writable, type Readable } from 'svelte/store';
import { createAutoSubmitter } from '$lib/onchain/auto-submit';
import { epochInfo, localComputer, time } from '$lib/time';
import {
	connection,
	publicClient,
	signer,
	type OptionalSigner,
	type Signer
} from '$lib/connection';
import { writes } from '$lib/onchain/writes';
import { keccak256 } from 'viem';
import contracts from '$lib/contracts';
import { privateKeyToAccount } from 'viem/accounts';
import type { Position } from 'dgame-contracts';

export type LocalAction = { type: 'move' | 'exit' | 'enter'; x: number; y: number };
export type LocalState =
	| { signer: undefined }
	| {
			signer: Signer;
			avatar?: {
				actions: LocalAction[];
				submission?: {
					commit: {
						secret: `0x${string}`;
						epoch: number;
						txHash: string;
						actions: LocalAction[];
					};
					reveal?: {
						epoch: number;
						txHash: string;
					};
				};
				epoch: number;
				avatarID: string;
			};
	  };

function defaultState() {
	return {
		signer: undefined
	};
}
const $state: LocalState = defaultState();

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
				localStorage.setItem(`__private__${$state.signer.owner}`, JSON.stringify($state));
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
						const fromStorageStr = localStorage.getItem(`__private__${$signer.owner}`);
						if (fromStorageStr) {
							const fromStorage = JSON.parse(fromStorageStr);
							set(fromStorage);
						} else {
							set({ signer: $signer });
						}
					} catch (err) {
						set({ signer: $signer });
					}
				} else {
					set({ signer: undefined });
				}
			}
		});
		return unsubscribeFromOptionalSigner;
	}
	let commiting = false;
	let revealing = false;
	return {
		get value() {
			return $state;
		},
		subscribe: _localState.subscribe,
		addAction(epoch: number, action: LocalAction) {
			if (!$state.signer) {
				throw new Error(`no signer`);
			}

			if (!$state.avatar) {
				throw new Error(`no avatar`);
			}

			if (epoch != $state.avatar.epoch) {
				$state.avatar = {
					avatarID: $state.avatar.avatarID,
					actions: [],
					epoch
				};
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
		enter(avatarID: bigint, epoch: number, position: Position) {
			if (!$state.signer) {
				throw new Error(`no signer`);
			}

			if ($state.avatar) {
				// TODO
				// if ($state.avatar.actions[0].type === 'enter') {
				// 	$state.avatar = undefined;
				// } else {
				throw new Error(`got an avatar already`);
				// }
			}

			const actions: LocalAction[] = [{ type: 'enter', x: position.x, y: position.y }];

			$state.avatar = {
				avatarID: avatarID.toString(),
				actions,
				epoch
			};

			set($state);
		},

		// async enter(avatarID: bigint, entrance: Position) {
		// 	if (!$state.signer) {
		// 		throw new Error(`no signer`);
		// 	}

		// 	const $epochInfo = epochInfo.now();
		// 	const { currentEpoch: epoch } = $epochInfo;

		// 	if ($state.avatar) {
		// 		throw new Error(`you got already one avatar in`);
		// 	}

		// 	console.log(`enterring for epoch ${epoch}...`);

		// 	let transactonHash: `0x${string}` | undefined;
		// 	try {
		// 		commiting = true;
		// 		const account = privateKeyToAccount($state.signer.privateKey);
		// 		const secretSig = await account.signMessage({
		// 			message: `Commit:${contracts.chainId}:${contracts.contracts.Game.address}:${epoch}`
		// 		});
		// 		const secret = keccak256(secretSig);
		// 		const actions: LocalAction[] = [
		// 			{
		// 				type: 'enter',
		// 				x: entrance.x,
		// 				y: entrance.y
		// 			}
		// 		];
		// 		const { transactionID, wait } = await writes.commit_actions(avatarID, secret, actions);
		// 		transactonHash = transactionID;
		// 		commiting = false;
		// 		$state.avatar = {
		// 			actions,
		// 			avatarID: avatarID.toString(),
		// 			epoch,
		// 			submission: {
		// 				commit: {
		// 					epoch,
		// 					secret,
		// 					txHash: transactionID
		// 				}
		// 			}
		// 		};
		// 		set($state);

		// 		await wait();
		// 	} catch (err) {
		// 		console.error(err);
		// 		commiting = false;
		// 	}

		// 	return transactonHash;
		// },

		async commit() {
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

			if (epoch != $state.avatar.epoch) {
				$state.avatar.actions = [];
				$state.avatar.epoch = epoch;
				set($state);
				throw new Error(`too late`);
			}

			console.log(`commiting for epoch ${epoch}...`);

			try {
				commiting = true;

				const block = await time.fetchBlockTime();
				const epochAccordingToBlockTime = localComputer.calculateEpochInfo(block.blockTime);

				if (!epochAccordingToBlockTime.isCommitPhase) {
					throw new Error(`time is not valid`);
				}

				const actions = [...$state.avatar.actions];

				const account = privateKeyToAccount($state.signer.privateKey);
				const secretSig = await account.signMessage({
					message: `Commit:${contracts.chainId}:${contracts.contracts.Game.address}:${epoch}`
				});
				const secret = keccak256(secretSig);
				const { transactionID, wait } = await writes.commit_actions(
					BigInt($state.avatar.avatarID),
					secret,
					actions
				);

				$state.avatar.submission = {
					commit: {
						epoch,
						secret,
						txHash: transactionID,
						actions
					}
				};
				set($state);

				console.log(`waiting for commit tx...`);

				const receipt = await wait();
				if (receipt.status === 'reverted') {
					$state.avatar.submission = undefined;
					set($state);
				}
			} catch (err) {
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

			if (epoch != $state.avatar.epoch) {
				$state.avatar.actions = [];
				$state.avatar.epoch = epoch;
			}

			if ($state.avatar.actions.length > 0) {
				if ($state.avatar.actions[$state.avatar.actions.length - 1].type !== 'enter') {
					$state.avatar.actions.pop();
				}
			}
			set($state);
		},

		async reveal() {
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

			if (epoch != $state.avatar.epoch) {
				$state.avatar.actions = [];
				$state.avatar.epoch = epoch;
				set($state);
				throw new Error(`too late`);
			}

			console.log(`revealing for epoch ${epoch}...`);

			const commitment = $state.avatar.submission?.commit;
			if (!commitment) {
				throw new Error(`cannot reveal without commitment info`);
			}

			try {
				revealing = true;

				const block = await time.fetchBlockTime();
				const epochAccordingToBlockTime = localComputer.calculateEpochInfo(block.blockTime);

				if (epochAccordingToBlockTime.isCommitPhase) {
					throw new Error(`time is not valid`);
				}
				const { transactionID, wait } = await writes.reveal_actions(
					BigInt($state.avatar.avatarID),
					commitment.secret,
					commitment.actions
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
				if (receipt.status === 'reverted') {
					$state.avatar.submission.reveal = undefined;
					set($state);
				}
			} catch (err) {
				console.error(err);
			} finally {
				revealing = false;
			}
		}
	};
}

export const localState = createLocalState(signer);

export const autoSubmitter = createAutoSubmitter();
autoSubmitter.start();

(globalThis as any).localState = localState;
