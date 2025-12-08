import { PerZoneCachedFetcher } from '$lib/core/utils/fetcher/per-zone-cached-fetcher';
import deployments from '$lib/deployments';
import { logs } from 'named-logs';

const console = logs('zones-fetcher');

const Game = deployments.contracts.Game;

export type CombinedZonesData = {};

export class ZonesFetcher extends PerZoneCachedFetcher<CombinedZonesData> {
	/**
	 * Executes the actual request for zones
	 */
	protected async executeRequest(
		zones: bigint[],
		fromBlock: number,
		toBlock: number,
		expectedEpoch?: number
	): Promise<CombinedZonesData & { epoch: number }> {
		// TODO
		return { epoch: expectedEpoch || 0 };
	}

	/**
	 * Merges multiple data results into one
	 */
	protected mergeData(
		data: CombinedZonesData[],
		epoch: number
	): CombinedZonesData & { epoch: number } {
		// TODO
		return {
			epoch
		};
	}
}

// Singleton instance
export const zonesFetcher = new ZonesFetcher();
