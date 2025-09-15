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
	avatarID?: string;
	entities: { [id: string]: ViewEntity };
};

export const onchainState = createDirectReadStore(camera);

export const viewState = derived(
	[onchainState, localState],
	([$onchainState, $localState]): ViewState => {
		const entities = { ...$onchainState.entities } as { [id: string]: ViewEntity };
		let avatarID: string | undefined;
		if ($localState.signer && $localState.avatar) {
			avatarID = $localState.avatar.avatarID;
			let avatarEntity = $onchainState.entities[avatarID] as PlayerEntity | undefined;
			if ($localState.avatar.actions[0]?.type === 'enter') {
				avatarEntity = {
					type: 'player',
					epoch: $localState.avatar.epoch,
					id: avatarID,
					life: 1,
					position: $localState.avatar.actions[0]
				};
			}

			if (avatarEntity) {
				const { currentEpoch: epoch } = epochInfo.now(); // we use now  instead of deriving from time

				let current_position = { ...avatarEntity.position };
				const path: Position[] = [];
				if ($localState.avatar.actions.length > 0 && $localState.avatar.epoch == epoch) {
					for (const action of $localState.avatar.actions) {
						path.push(current_position);
						if (action.type === 'move') {
							current_position = { x: action.x, y: action.y };
						}
					}
				}
				entities[avatarID] = {
					...avatarEntity,
					position: current_position,
					path
				};
			}
		}

		return {
			avatarID,
			entities
		};
	}
);

(globalThis as any).viewState = viewState;
(globalThis as any).get = get;
