import type {AvatarEntity, OnchainState} from '$lib/onchain/types';
import {derived, type Readable} from 'svelte/store';
import {
	computeUpdatedLocalState,
	type LocalAction,
	type LocalState,
} from '../private/localState';
import type {TypedDeployments} from '$lib/core/connection/types';

export type Position = {x: number; y: number};

export type AvatarViewEntity = AvatarEntity & {
	plannedActions?: LocalAction[];
	entering: boolean;
};
export type ViewEntity = AvatarViewEntity;
export type ViewEntities = {[id: string]: ViewEntity};
export type ViewState = {
	avatar?: {id: string; numMoves: number};
	entities: ViewEntities;
	epoch: number;
};

export type ViewStateStore = Readable<ViewState>;

export function createViewState(
	onchainState: Readable<OnchainState>,
	localState: Readable<LocalState>,
	deployments: TypedDeployments, // TODO use store
) {
	const viewState = derived(
		[onchainState, localState],
		([$onchainState, localStateFromStore]): ViewState => {
			const epoch = $onchainState.epoch;
			const $localState = computeUpdatedLocalState(localStateFromStore, epoch);

			const entities: ViewEntities = {};
			for (const entityID of Object.keys($onchainState.entities)) {
				const onchainEntity = $onchainState.entities[entityID];
				if (onchainEntity.type === 'avatar') {
					entities[entityID] = {
						...onchainEntity,
						entering: false,
					};
				}
			}
			let avatarData: {id: string; numMoves: number} | undefined;
			if ($localState.signer && $localState.avatar) {
				const currentAvatarID = $localState.avatar.avatarID;
				let avatarEntity = entities[currentAvatarID] as
					| AvatarViewEntity
					| undefined;
				if (avatarEntity || !$localState.avatar.exiting) {
					let numMoves = Number(deployments.contracts.Game.linkedData.numMoves);

					avatarData = {
						id: currentAvatarID,
						numMoves:
							numMoves -
							$localState.avatar.actions.filter((v) => v.type === 'move')
								.length,
					};

					if ($localState.avatar.actions[0]?.type === 'enter') {
						avatarEntity = {
							owner: $localState.signer.owner,
							type: 'avatar',
							id: avatarData.id,
							life: 1,
							position: $localState.avatar.actions[0],
							lastEpoch: epoch,
							previousActions: [],
							entering: true,
						};
						entities[avatarData.id] = avatarEntity;
					}

					if (avatarEntity) {
						const actions: LocalAction[] = [];
						let current_action: LocalAction = {
							type: 'move',
							...avatarEntity.position,
						};
						actions.push(current_action);
						// console.log(`current pos`, current_position);

						if (
							$localState.avatar.actions.length > 0 &&
							$localState.avatar.epoch == epoch
						) {
							for (const action of $localState.avatar.actions) {
								current_action = {...action};
								actions.push(current_action);
							}
						}
						avatarEntity.plannedActions = actions;
					}
				}
			}

			for (const entityID of Object.keys(entities)) {
				const entity = entities[entityID];
				if (entity.type === 'avatar' && entityID != avatarData?.id) {
					// TODO
					if (entity.life == 0 && entity.lastEpoch + 1 < epoch) {
						delete entities[entityID];
					}
				}
			}

			return {
				avatar: avatarData,
				entities,
				epoch: $onchainState.epoch,
			};
		},
	);

	return viewState;
}
