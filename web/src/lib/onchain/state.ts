import {createDirectReadStore} from '$lib/onchain/direct-read';
import type {AvatarEntity} from '$lib/onchain/types';
import {bigIntIDToXY} from 'reveal-or-die-contracts';
import {type LocalAction} from '../private/localState';
import type {CameraWatcher} from '$lib/core/render/camera';
import type {ZonesFetcher} from './zones-fetcher';
import type {PublicClient} from 'viem';
import type {EpochInfoStore} from '$lib/types';
import type {TypedDeployments} from '$lib/core/connection/types';

// Define the state type that the store will use
type OnchainState = {
	entities: {[id: string]: AvatarEntity};
	epoch: number;
};

const defaultState = (): OnchainState => ({
	entities: {},
	epoch: 0,
});

export function createOnchainState(params: {
	camera: CameraWatcher;
	deployments: TypedDeployments;
	zonesFetcher: ZonesFetcher;
	epochInfo: EpochInfoStore;
	publicClient: PublicClient;
}) {
	const {camera, deployments, zonesFetcher, epochInfo, publicClient} = params;
	const onchainState = createDirectReadStore<OnchainState>(
		{camera, epochInfo, publicClient, deployments},
		defaultState,
		async (zones, fromBlock, toBlock, expectedEpoch) => {
			const zoneData = await zonesFetcher.fetchZones(
				zones,
				fromBlock,
				toBlock,
				expectedEpoch,
			);

			if (!zoneData) {
				// the request has been dismissed
				return undefined;
			}

			const state: OnchainState = defaultState();

			const epoch = BigInt(zoneData.epoch);
			state.epoch = Number(epoch);

			// Separate old events (epoch - 2) from current events (epoch - 1)
			const events = zoneData.events.filter((v) => v.args.epoch == epoch - 1n);

			const avatarEvents: Map<
				bigint,
				import('viem').GetContractEventsReturnType<
					typeof deployments.contracts.Game.abi,
					'CommitmentRevealed',
					true
				>[0]
			> = new Map();
			for (const event of events) {
				avatarEvents.set(event.args.avatarID, event);
			}

			for (const entityFetched of zoneData.entities) {
				const id = entityFetched.avatarID.toString();

				let actions: LocalAction[] = [];

				const event = avatarEvents.get(entityFetched.avatarID);
				if (event) {
					actions = event.args.actions.map((v) => {
						const coords = bigIntIDToXY(v.data);
						return {
							type:
								v.actionType === 0
									? 'enter'
									: v.actionType === 1
										? 'move'
										: 'exit',
							x: coords.x,
							y: coords.y,
						};
					});
				}

				const {x, y} = bigIntIDToXY(entityFetched.position);
				const entity: AvatarEntity = {
					id,
					owner: entityFetched.owner,
					type: 'avatar',
					position: {
						x: Number(x),
						y: Number(y),
					},
					life: entityFetched.life,
					lastEpoch: Number(entityFetched.lastEpoch),
					previousActions: actions,
				};
				state.entities[id] = entity;
			}

			return state;
		},
	);
	return onchainState;
}
