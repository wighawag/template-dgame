import { camera } from '$lib/core/render/camera';
import { createDirectReadStore } from '$lib/onchain/direct-read';
import { zonesFetcher } from '$lib/onchain/zones-fetcher';
import type { OnchainState } from './types';

const defaultState = (): OnchainState => ({
	epoch: 0
});

export const onchainState = createDirectReadStore<OnchainState>(
	camera,
	defaultState,
	async (zones, fromBlock, toBlock, expectedEpoch) => {
		const zoneData = await zonesFetcher.fetchZones(zones, fromBlock, toBlock, expectedEpoch);

		if (!zoneData) {
			// the request has been dismissed
			return undefined;
		}

		const state: OnchainState = defaultState();

		const epoch = BigInt(zoneData.epoch);
		state.epoch = Number(epoch);

		return state;
	}
);
