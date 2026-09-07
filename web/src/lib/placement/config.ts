/**
 * The template game's constants, read off the deployment.
 *
 * Everything here comes from the Game contract's `linkedData` (what the deploy
 * script recorded) rather than being duplicated in the front end, so changing
 * the phase durations or the placement cost in `contracts/deploy` cannot leave
 * the UI describing a different game from the one on chain.
 */
import type {TypedDeployments} from '$lib/core/connection/types';
import {resolveEpochConfig, type EpochConfig} from '$lib/game/core/epoch';

export type PlacementConfig = {
	epoch: EpochConfig;
	/** What one placement costs, taken from the player's reserve on reveal. */
	placementCost: bigint;
	/** The ERC20 the reserve is denominated in. */
	tokenAddress: `0x${string}`;
	/**
	 * Where a stake is acquired, and what it costs.
	 *
	 * The price is read off the SALE's own `linkedData` rather than the Game's,
	 * because it is the sale contract's to state: `StakeSale.purchase` reverts
	 * with `WrongPaymentAmount` unless the value it is sent matches exactly, so a
	 * number copied anywhere else is a number that can drift into reverting every
	 * purchase.
	 */
	sale: {
		address: `0x${string}`;
		/** In the chain's native currency, exact. Not a minimum. */
		price: bigint;
		/** How much reserve one purchase credits. */
		amount: bigint;
		/**
		 * What the purchase forwards to the local signer, in the same transaction.
		 *
		 * This is what makes onboarding ONE transaction rather than two: the sale
		 * pays the signer before the price is checked, so the call that stakes puts
		 * gas in the key that will spend it. Funding the signer separately means a
		 * second transaction from a wallet the first one just emptied.
		 *
		 * Sized in TURNS rather than as a round number, because what the player
		 * actually needs is a number of moves: see `TURNS_OF_GAS`.
		 */
		stipend: bigint;
	};
	/**
	 * Pixels per cell at 1:1 zoom.
	 *
	 * Only a scene-graph renderer cares: it is the unit pixi content is authored
	 * in. The camera and the click maths are in game units and do not use it.
	 */
	cellSize: number;
	/**
	 * What the camera may show, in CELLS.
	 *
	 * Here rather than in a canvas component because it is a statement about the
	 * GAME (how much board is playable at a glance), not about a rendering
	 * library, and because both canvas hosts have to agree on it.
	 */
	camera: {
		/** How much board is visible on the first frame. */
		initialVisible: {width: number; height: number};
		/** Zoom limits, as the smallest and largest slice of board on screen. */
		limits: {
			minWidth: number;
			minHeight: number;
			maxWidth: number;
			maxHeight: number;
		};
	};
};

type GameLinkedData = {
	startTime: unknown;
	commitPhaseDuration: unknown;
	revealPhaseDuration: unknown;
	placementCost: unknown;
	tokens: unknown;
};

type SaleLinkedData = {
	price: unknown;
	amount: unknown;
};

/**
 * Gas to allow for one turn: a commit and the reveal that must follow it.
 *
 * Deliberately generous, and the reveal more so than the commit. A commit
 * writes one hash; a reveal walks every placement, each of which can touch a
 * zone index. Running out of gas mid-round is not a slow turn, it is a missed
 * reveal, which loses the bond AND blocks the next epoch until it is
 * acknowledged. Over-reserving costs a slightly larger first payment.
 */
const COMMIT_GAS = 100_000n;
const REVEAL_GAS = 2_000_000n;

/**
 * How many turns of gas a new player is given.
 *
 * The whole point of the stipend is that a player who has just staked can play
 * for a while without thinking about gas at all. When it does run out the
 * top-up flow is the remedy (and `resumeWhenGasArrives` picks the round back up
 * by itself), so this is a starting float rather than a budget.
 */
const TURNS_OF_GAS = 100n;

export function resolvePlacementConfig(
	deployments: TypedDeployments,
): PlacementConfig {
	const linkedData = deployments.contracts.Game.linkedData as GameLinkedData;
	const StakeSale = deployments.contracts.StakeSale;
	const saleData = StakeSale.linkedData as SaleLinkedData;

	return {
		epoch: resolveEpochConfig(linkedData),
		placementCost: BigInt(linkedData.placementCost as string | number | bigint),
		tokenAddress: linkedData.tokens as `0x${string}`,
		sale: {
			address: StakeSale.address,
			price: BigInt(saleData.price as string | number | bigint),
			amount: BigInt(saleData.amount as string | number | bigint),
			// The chain's own statement of the worst gas price it expects, which is
			// what the credits machinery upstream prices actions with too. A chain
			// that does not declare one gets no stipend rather than a guessed one:
			// the purchase still works, and the signer is funded by the top-up flow.
			stipend:
				BigInt(
					(deployments.chain.properties.expectedWorstGasPrice as
						string | number | undefined) ?? 0,
				) *
				(COMMIT_GAS + REVEAL_GAS) *
				TURNS_OF_GAS,
		},
		cellSize: 10,
		camera: {
			initialVisible: {width: 24, height: 24},
			limits: {minWidth: 10, minHeight: 10, maxWidth: 100, maxHeight: 100},
		},
	};
}

/** What a set of placements will cost, and so what has to be bonded. */
export function costOfPlacements(
	config: PlacementConfig,
	count: number,
): bigint {
	return config.placementCost * BigInt(count);
}
