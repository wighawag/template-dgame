import {PerZoneCachedFetcher} from '$lib/core/utils/fetcher/per-zone-cached-fetcher';
import {logs} from 'named-logs';
import {type GetContractEventsReturnType, type PublicClient} from 'viem';
import deploymentsFromFiles from '$lib/deployments';
import type {TypedDeployments} from '$lib/core/connection/types';

const console = logs('zones-fetcher');

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
	events: GetContractEventsReturnType<
		typeof deploymentsFromFiles.contracts.Game.abi,
		'CommitmentRevealed',
		true
	>;
};

export class ZonesFetcher extends PerZoneCachedFetcher<CombinedZonesData> {
	protected publicClient: PublicClient;
	protected deployments: TypedDeployments;
	constructor(params: {
		publicClient: PublicClient;
		deployments: TypedDeployments;
	}) {
		super();
		this.publicClient = params.publicClient;
		this.deployments = params.deployments;
	}
	/**
	 * Executes the actual request for zones
	 */
	protected async executeRequest(
		zones: bigint[],
		fromBlock: number,
		toBlock: number,
		expectedEpoch?: number,
	): Promise<CombinedZonesData & {epoch: number}> {
		const Game = this.deployments.contracts.Game;
		// Fetch entities from contract
		const result = await this.publicClient.readContract({
			...Game,
			functionName: 'getAvatarsInMultipleZones',
			args: [zones, 0n, 100n], // TODO use pagination
			// TODO when skip commit phase
			// blockNumber: BigInt(toBlock)
		});

		const fetchedEpoch = result[2];

		if (expectedEpoch !== undefined) {
			// Validate epoch
			if (Number(fetchedEpoch) < expectedEpoch) {
				throw new Error(
					`expected epoch ${expectedEpoch}, got ${fetchedEpoch}, we are out of sync, or node is lagging`,
				);
			}
		}

		// Fetch events
		const fetchedEvents = await this.getContractEventsBatched(
			this.publicClient,
			Game,
			'CommitmentRevealed',
			{
				epoch: [fetchedEpoch - 1n],
				zone: zones,
			},
			BigInt(fromBlock),
			BigInt(toBlock),
			1000, // max 1k blocks per batch //TODO configure per RPC
		);

		// Cache the raw results for each zone that was fetched
		// Since we don't have zone information in the entities, we cache the entire result set
		// for each zone that was requested
		for (const zone of zones) {
			this.zonesCache.set(zone, {
				entities: result[0],
				events: fetchedEvents,
			});
		}

		console.dir({
			poch: Number(result[1]),
			entities: result[0],
			events: fetchedEvents,
		});

		return {
			epoch: Number(result[1]),
			entities: result[0],
			events: fetchedEvents,
		};
	}

	/**
	 * Merges multiple data results into one
	 */
	protected mergeData(
		data: CombinedZonesData[],
		epoch: number,
	): CombinedZonesData & {epoch: number} {
		const Game = this.deployments.contracts.Game;
		let allEntities: OnchainEntities = [];
		let allEvents: GetContractEventsReturnType<
			typeof Game.abi,
			'CommitmentRevealed',
			true
		> = [];

		for (const result of data) {
			allEntities.push(...result.entities);
			allEvents.push(...result.events);
		}

		return {
			entities: allEntities,
			events: allEvents,
			epoch,
		};
	}

	/**
	 * Fetches contract events in batches to handle large block ranges more efficiently
	 */
	private async getContractEventsBatched(
		client: typeof this.publicClient,
		contract: typeof deploymentsFromFiles.contracts.Game,
		eventName: 'CommitmentRevealed',
		args: any,
		fromBlock: bigint,
		toBlock: bigint,
		maxBlockRange: number = 10000,
	): Promise<
		GetContractEventsReturnType<
			typeof deploymentsFromFiles.contracts.Game.abi,
			'CommitmentRevealed',
			true
		>
	> {
		const batchSize = Math.min(maxBlockRange, Number(toBlock - fromBlock + 1n));
		const batches: Array<{from: bigint; to: bigint}> = [];

		console.log(`fetching events`, fromBlock, toBlock);

		// Calculate batch boundaries
		let currentFrom = fromBlock;
		while (currentFrom <= toBlock) {
			const currentTo = currentFrom + BigInt(batchSize - 1);
			batches.push({
				from: currentFrom,
				to: currentTo > toBlock ? toBlock : currentTo,
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
					toBlock: batch.to,
				});
			} catch (error) {
				console.error(
					`Failed to fetch events for batch ${batch.from}-${batch.to}:`,
					error,
				);
				throw error;
			}
		});

		// Wait for all batches to complete
		const results = await Promise.all(batchPromises);

		// Flatten and return all events
		return results.flat();
	}
}
