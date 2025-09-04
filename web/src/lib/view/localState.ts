import { get, writable, type Readable } from 'svelte/store';
import { viewState } from '.';
import { createAutoSubmitter } from '$lib/onchain/auto-submit';
import { writes } from '$lib/onchain/writes';
import { epochInfo } from '$lib/time';
import { signer, type OptionalSigner } from '$lib/connection';

export type LocalAction = { type: 'move'; x: number; y: number } | { type: 'placeBomb' };
export type LocalState = {
	signer: OptionalSigner;
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
};

function defaultState() {
	return {
		signer: undefined,
		actions: [],
		epoch: 0
	};
}
const $state: LocalState = defaultState();

export function createLocalState(signer: Readable<OptionalSigner>) {
	const _localState = writable<LocalState>($state, start);

	function start() {
		const unsubscribeFromOptionalSigner = signer.subscribe(($signer) => {
			if ($signer?.owner !== $state.signer?.owner) {
				// TODO use local storage
				if ($signer) {
					$state.signer = { ...$signer };
				} else {
					$state.signer = undefined;
				}
				$state.actions = [];
				$state.epoch = 0;

				_localState.set($state);
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
		move(x: number, y: number) {
			if (!$state.signer) {
				throw new Error(`no signer`);
			}

			// TODO not entered

			const $epochInfo = epochInfo.now();
			const { currentEpoch: epoch } = $epochInfo;

			if (epoch != $state.epoch) {
				$state.actions = [];
				$state.epoch = epoch;
			}

			// TODO player.position;
			let currentPosition = { x: 0, y: 0 };
			if ($state.actions.length > 0) {
				for (const action of $state.actions) {
					if (action.type === 'move') {
						currentPosition = { x: action.x, y: action.y };
					}
				}
			}

			$state.actions.push({
				type: 'move',
				x: currentPosition.x + x,
				y: currentPosition.y + y
			});
			_localState.set($state);
		},
		placeBomb() {
			// TODO
			// const player = get(viewState).entities[wallet.address.toAddress()];
			// const $epochInfo = epochInfo.now();
			// const { currentEpoch: epoch } = $epochInfo;
			// if (!player) {
			// 	throw new Error(`no player`);
			// }
			// if (epoch.currentEpoch != $state.epoch) {
			// 	$state.actions = [];
			// 	$state.epoch = epoch.currentEpoch;
			// }
			// let currentPosition = player.position;
			// if ($state.actions.length > 0) {
			// 	for (const action of $state.actions) {
			// 		if (action.type === 'move') {
			// 			currentPosition = { x: action.x, y: action.y };
			// 		}
			// 	}
			// }
			// $state.actions.push({
			// 	type: 'placeBomb'
			// });
			// _localState.set($state);
		},

		async commit() {
			if (commiting) {
				console.log(`already commiting...`);
				return;
			}

			const $epochInfo = epochInfo.now();
			const { currentEpoch: epoch } = $epochInfo;

			if (epoch != $state.epoch) {
				$state.actions = [];
				$state.epoch = epoch;
				_localState.set($state);
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
			// 	_localState.set($state);

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
			const $epochInfo = epochInfo.now();
			const { currentEpoch: epoch } = $epochInfo;

			if (epoch != $state.epoch) {
				$state.actions = [];
				$state.epoch = epoch;
				_localState.set($state);
				throw new Error(`too late`);
			}

			console.log(`revealing for epoch ${epoch}...`);

			const commitment = $state.submission?.commit;
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
				// _localState.set($state);

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
