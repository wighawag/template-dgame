import { get, writable, type Readable } from 'svelte/store';
import { createAutoSubmitter } from '$lib/onchain/auto-submit';
import { epochInfo } from '$lib/time';
import { signer, type OptionalSigner, type Signer } from '$lib/connection';

export type LocalAction = { type: 'move'; x: number; y: number };
export type LocalState =
	| { signer: undefined }
	| {
			signer: Signer;
			avatar?: {
				actions: LocalAction[];
				submission?: {
					commit: {
						secret: string;
						epoch: number;
						txHash: string;
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
			for (const key of Object.keys(state)) {
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
				$state.avatar.actions = [];
				$state.avatar.epoch = epoch;
			}

			$state.avatar.actions.push(action);
			set($state);
		},

		enter(epoch: number, avatarID: bigint, location: bigint, hash: `0x${string}`) {
			if (!$state.signer) {
				throw new Error(`no signer`);
			}
			$state.avatar = {
				actions: [],
				avatarID: avatarID.toString(),
				epoch: 0 // TODO
			};
			set($state);
		},
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

			// TODO
			// const secret = '0x0000000000000000000000000000000000000000000000000000000000000001';

			// TODO
			// try {
			// 	commiting = true;
			// 	const { transactionID, wait } = await writes.commit_actions(secret, $state.actions);
			// 	commiting = false;
			// 	$state.submission = {
			// 		commit: {
			// 			epoch,
			// 			secret,
			// 			txHash: transactionID
			// 		}
			// 	};
			// 	set($state);

			// 	await wait();
			// } catch (err) {
			// 	console.error(err);
			// 	commiting = false;
			// }
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
				// TODO
				// const { transactionID, wait } = await writes.reveal_actions(
				// 	wallet.address.toAddress(),
				// 	commitment.secret,
				// 	$state.actions
				// );
				revealing = false;

				// $state.submission = {
				// 	commit: commitment,
				// 	reveal: {
				// 		epoch,
				// 		txHash: transactionID
				// 	}
				// };
				// set($state);

				// await wait();
			} catch (err) {
				console.error(err);
				revealing = false;
			}
		}
	};
}

export const localState = createLocalState(signer);

export const autoSubmitter = createAutoSubmitter();
autoSubmitter.start();
