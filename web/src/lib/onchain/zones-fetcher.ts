import { publicClient } from '$lib/connection';
import deployments from '$lib/deployments';
import { type GetContractEventsReturnType } from 'viem';
import { logs } from 'named-logs';
import { PerZoneCachedFetcher } from '$lib/utils/fetcher/per-zone-cached-fetcher';
import { get } from 'svelte/store';
import { time } from '$lib/time';

const console = logs('zones-fetcher');

const Game = deployments.contracts.Game;

type OnchainEntities = {
	owner: `0x${string}`;
	avatarID: bigint;
	inGame: boolean;
	position: bigint;
	lastEpoch: bigint;
	life: number;
}[];

export type CombinedZonesData = {
	entities: Readonly<OnchainEntities>;
	events: GetContractEventsReturnType<typeof Game.abi, 'CommitmentRevealed', true>;
};

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
		// Fetch entities from contract
		const result = await publicClient.readContract({
			...Game,
			functionName: 'getAvatarsInMultipleZones',
			args: [zones, 0n, 100n] // TODO use pagination
		});

		const fetchedEpoch = result[2];

		if (expectedEpoch !== undefined) {
			// Validate epoch
			if (Number(fetchedEpoch) < expectedEpoch) {
				throw new Error(
					`expected epoch ${expectedEpoch}, got ${fetchedEpoch}, we are out of sync, or node is lagging`
				);
			}
		}

		// Fetch events
		const fetchedEvents = await this.getContractEventsBatched(
			publicClient,
			Game,
			'CommitmentRevealed',
			{
				epoch: [fetchedEpoch - 1n],
				zone: zones
			},
			BigInt(fromBlock),
			BigInt(toBlock),
			1000 // max 1k blocks per batch //TODO configure per RPC
		);

		// Cache the raw results for each zone that was fetched
		// Since we don't have zone information in the entities, we cache the entire result set
		// for each zone that was requested
		for (const zone of zones) {
			this.zonesCache.set(zone, {
				entities: result[0],
				events: fetchedEvents
			});
		}

		console.dir({
			poch: Number(result[1]),
			entities: result[0],
			events: fetchedEvents
		});

		return {
			epoch: Number(result[1]),
			entities: result[0],
			events: fetchedEvents
		};
	}

	/**
	 * Merges multiple data results into one
	 */
	protected mergeData(
		data: CombinedZonesData[],
		epoch: number
	): CombinedZonesData & { epoch: number } {
		let allEntities: OnchainEntities = [];
		let allEvents: GetContractEventsReturnType<typeof Game.abi, 'CommitmentRevealed', true> = [];

		for (const result of data) {
			allEntities.push(...result.entities);
			allEvents.push(...result.events);
		}

		return {
			entities: allEntities,
			events: allEvents,
			epoch
		};
	}

	/**
	 * Fetches contract events in batches to handle large block ranges more efficiently
	 */
	private async getContractEventsBatched(
		client: typeof publicClient,
		contract: typeof Game,
		eventName: 'CommitmentRevealed',
		args: any,
		fromBlock: bigint,
		toBlock: bigint,
		maxBlockRange: number = 10000
	): Promise<GetContractEventsReturnType<typeof Game.abi, 'CommitmentRevealed', true>> {
		const batchSize = Math.min(maxBlockRange, Number(toBlock - fromBlock + 1n));
		const batches: Array<{ from: bigint; to: bigint }> = [];

		console.log(`fetching events`, fromBlock, toBlock);

		// Calculate batch boundaries
		let currentFrom = fromBlock;
		while (currentFrom <= toBlock) {
			const currentTo = currentFrom + BigInt(batchSize - 1);
			batches.push({
				from: currentFrom,
				to: currentTo > toBlock ? toBlock : currentTo
			});
			currentFrom = currentTo + 1n;
		}

		// Fetch all batches
		const batchPromises = batches.map(async (batch) => {
			try {
				return await client.getContractEvents({
					...contract,
					eventName,
					args,
					strict: true,
					fromBlock: batch.from,
					toBlock: batch.to
				});
			} catch (error) {
				console.error(`Failed to fetch events for batch ${batch.from}-${batch.to}:`, error);
				throw error;
			}
		});

		// Wait for all batches to complete
		const results = await Promise.all(batchPromises);

		// Flatten and return all events
		return results.flat();
	}
}

// Singleton instance
export const zonesFetcher = new ZonesFetcher();
