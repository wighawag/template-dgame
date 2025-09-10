import { createDirectReadStore } from '$lib/onchain/direct-read';
import type { PlayerEntity } from '$lib/onchain/types';
import { camera } from '$lib/render/camera';
import { derived, get, writable } from 'svelte/store';
import { localState } from '../private/localState';
import { epochInfo, time } from '$lib/time';

export type Position = { x: number; y: number };

export type PlayerViewEntity = PlayerEntity & {
	path?: Position[];
};
export type ViewEntity = PlayerViewEntity;
export type ViewState = {
	playerID?: `0x${string}`;
	entities: { [id: string]: ViewEntity };
};

export const onchainState = createDirectReadStore(camera);

export const viewState = derived(
	[onchainState, localState],
	([$onchainState, $localState]): ViewState => {
		const playerID = $localState.signer?.owner; // TODO avatar ID
		const entities = { ...$onchainState.entities } as { [id: string]: ViewEntity };
		if (playerID) {
			const onchain_player = $onchainState.entities[playerID] as PlayerEntity | undefined;

			if (onchain_player) {
				const { currentEpoch: epoch } = epochInfo.now(); // we use now  instead of deriving from time

				let current_position = { ...onchain_player.position };
				const path: Position[] = [];
				if ($localState.actions.length > 0 && $localState.epoch == epoch) {
					for (const action of $localState.actions) {
						path.push(current_position);
						if (action.type === 'move') {
							current_position = { x: action.x, y: action.y };
						}
					}
				}
				entities[playerID] = {
					...onchain_player,
					position: current_position,
					path
				};

				return {
					playerID,
					entities
				};
			}
		}

		return {
			playerID,
			entities
		};
	}
);

(globalThis as any).viewState = viewState;
(globalThis as any).get = get;
