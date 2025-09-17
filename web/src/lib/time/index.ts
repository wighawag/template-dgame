import { connection } from '$lib/connection';
import contracts from '$lib/contracts';
import { derived, writable, type Readable } from 'svelte/store';

export type SyncedTime = {
	lastSync?: { timestampMS: number; blockNumber: number };
	value: number;
};

export function createTime() {
	let last_time = Math.floor(Date.now() / 1000);
	let last_fetch_time = performance.now();
	let $time: SyncedTime = { value: last_time };
	const time = writable<SyncedTime>($time, start);

	function set(newTime: SyncedTime) {
		$time.lastSync = newTime.lastSync;
		$time.value = newTime.value;
		time.set($time);
	}

	function start() {
		let interval = setInterval(() => {
			const now = performance.now();
			const timePassed = now - last_fetch_time;
			set({ value: last_time + timePassed / 1000, lastSync: $time.lastSync });
		}, 1000);

		sync();

		return () => clearInterval(interval);
	}

	async function sync() {
		const synced = await updateTimeFromProvider();
		if (!synced) {
			setTimeout(sync, 1000);
		}
	}

	async function fetchBlockTime(): Promise<{ blockNumber: number; blockTime: number }> {
		const blockResponse = await connection.provider.call('eth_getBlockByNumber')([
			'latest',
			false as true // TODO fix eip-1193 Methods
		]);
		if (blockResponse.success && blockResponse.value) {
			const lastBlockTime = Number(blockResponse.value.timestamp);

			const block = { blockNumber: Number(blockResponse.value.number), blockTime: lastBlockTime };
			const currentTime = now();
			if (lastBlockTime < currentTime) {
				console.log(`time is ${currentTime - lastBlockTime} seconds ahead from block time`);
				updateTimeFromBlock(performance.now(), block);
			}

			return block;
		} else {
			throw new Error(`could not fetch latest block`);
		}
	}

	function updateTimeFromBlock(
		fetchTime: number,
		block: { blockTime: number; blockNumber: number }
	) {
		last_time = block.blockTime;
		last_fetch_time = fetchTime;

		const now = performance.now();
		const timePassed = now - last_fetch_time;
		set({
			value: last_time + timePassed / 1000,
			lastSync: {
				timestampMS: last_fetch_time,
				blockNumber: block.blockNumber
			}
		});
	}

	async function updateTimeFromProvider() {
		const before_fetch = performance.now();
		try {
			const blockResponse = await connection.provider.call('eth_getBlockByNumber')([
				'latest',
				false as true // TODO fix eip-1193 Methods
			]);

			if (blockResponse.success && blockResponse.value) {
				const lastBlockTime = Number(blockResponse.value.timestamp);
				const after_fetch = performance.now();
				const predicted_fetch_time = (before_fetch + after_fetch) / 2;

				updateTimeFromBlock(predicted_fetch_time, {
					blockTime: lastBlockTime,
					blockNumber: Number(blockResponse.value.number)
				});
				return true;
			}
			return !!$time.lastSync;
		} catch (err) {
			console.error(`failed to fetch from block time`, err);
			return false;
		}
	}

	// used for debugging
	async function checkTime() {
		const block = await fetchBlockTime();
		return block;
	}

	function now() {
		const now = performance.now();
		const timePassed = now - last_fetch_time;
		return last_time + timePassed / 1000;
	}

	return {
		now,
		updateTimeFromProvider,
		subscribe: time.subscribe,
		fetchBlockTime,
		checkTime
	};
}

export const time = createTime();

export type EpochInfo = {
	currentEpoch: number;
	timeLeftInEpoch: number;
	timeInCurrentEpochCycle: number;
	isCommitPhase: boolean;
	timeLeftInPhase: number;
	timeLeftForCommitEnd: number;
	timeLeftForRevealEnd: number;
	commitPhaseDuration: number;
	revealPhaseDuration: number;
	currentPhaseDuration: number;
};

export function createLocalComputer(config: {
	COMMIT_PHASE_DURATION: number;
	REVEAL_PHASE_DURATION: number;
	START_TIME?: number;
}) {
	function calculateEpochInfo(currentTime: number): EpochInfo {
		const COMMIT_PHASE_DURATION = config.COMMIT_PHASE_DURATION;
		const REVEAL_PHASE_DURATION = config.REVEAL_PHASE_DURATION;
		const EPOCH_DURATION = COMMIT_PHASE_DURATION + REVEAL_PHASE_DURATION;
		const START_TIME = config.START_TIME || 0;

		const timePassed = currentTime - START_TIME;

		// Calculate current epoch (minimum epoch is 2 as per contract logic)
		const currentEpoch = Math.floor(timePassed / EPOCH_DURATION) + 2;

		// Calculate time within current epoch cycle
		const timeInCurrentEpochCycle = timePassed - (currentEpoch - 2) * EPOCH_DURATION;

		// Calculate time left in current epoch
		const timeLeftInEpoch = EPOCH_DURATION - timeInCurrentEpochCycle;

		// Determine if we're in commit phase or reveal phase
		const isCommitPhase = timeInCurrentEpochCycle < COMMIT_PHASE_DURATION;

		// Calculate time left for commit phase end (when commit phase will end)
		const timeLeftForCommitEnd = isCommitPhase
			? COMMIT_PHASE_DURATION - timeInCurrentEpochCycle
			: 0; // If we're in reveal phase, commit phase has already ended

		// Calculate time left for reveal phase end (when reveal phase will end, i.e., epoch end)
		const timeLeftForRevealEnd = timeLeftInEpoch;

		return {
			currentEpoch,
			timeLeftInEpoch,
			timeInCurrentEpochCycle,
			isCommitPhase,
			timeLeftInPhase: isCommitPhase
				? COMMIT_PHASE_DURATION - timeInCurrentEpochCycle
				: REVEAL_PHASE_DURATION - (timeInCurrentEpochCycle - COMMIT_PHASE_DURATION),
			timeLeftForCommitEnd,
			timeLeftForRevealEnd,
			commitPhaseDuration: COMMIT_PHASE_DURATION,
			revealPhaseDuration: REVEAL_PHASE_DURATION,
			currentPhaseDuration: isCommitPhase ? COMMIT_PHASE_DURATION : REVEAL_PHASE_DURATION
		};
	}

	return {
		calculateEpochInfo
	};
}

export const timeConfig = {
	COMMIT_PHASE_DURATION: Number(contracts.contracts.Game.linkedData.commitPhaseDuration),
	REVEAL_PHASE_DURATION: Number(contracts.contracts.Game.linkedData.revealPhaseDuration),
	START_TIME: Number(contracts.contracts.Game.linkedData.startTime),
	COMMIT_TIME_ALLOWANCE: Number(contracts.contracts.Game.linkedData.revealPhaseDuration) + 0.1
};

export const localComputer = createLocalComputer(timeConfig);

// export const epochInfo = derived(time, (t) => localComputer.calculateEpochInfo(t.value));

const _epochInfo = writable<EpochInfo>(localComputer.calculateEpochInfo(time.now()), (set) => {
	const unsubscribeFromTime = time.subscribe(($time) => {
		set(localComputer.calculateEpochInfo($time.value));
	});
	return unsubscribeFromTime;
});

export const epochInfo = {
	subscribe: _epochInfo.subscribe,
	now() {
		return localComputer.calculateEpochInfo(time.now());
	},
	fromTime(now: number) {
		return localComputer.calculateEpochInfo(now);
	}
};

export type ThreePhase = {
	phase: 'play' | 'commit' | 'reveal';
	timeLeft: number;
	duration: number;
};

export const threePhase = derived<Readable<EpochInfo>, ThreePhase>(epochInfo, ($epochInfo) => {
	let phase: 'play' | 'commit' | 'reveal' = 'reveal';
	let timeLeft = $epochInfo.timeLeftInPhase;
	let duration = $epochInfo.currentPhaseDuration;

	if ($epochInfo.isCommitPhase) {
		phase = 'play';
		if ($epochInfo.timeLeftInPhase < timeConfig.COMMIT_TIME_ALLOWANCE) {
			phase = 'commit';
			duration = timeConfig.COMMIT_TIME_ALLOWANCE;
		} else {
			duration -= timeConfig.COMMIT_TIME_ALLOWANCE;
			timeLeft -= timeConfig.COMMIT_TIME_ALLOWANCE;
		}
	}
	return {
		phase,
		timeLeft,
		duration
	};
});

export type TwoPhase = {
	phase: 'play' | 'wait';
	timeLeft: number;
	duration: number;
};

export const twoPhase = derived<Readable<ThreePhase>, TwoPhase>(threePhase, ($threePhase) => {
	let phase: 'play' | 'wait' = 'play';
	let timeLeft = $threePhase.timeLeft;
	let duration = $threePhase.duration;
	if ($threePhase.phase === 'commit') {
		phase = 'wait';
		timeLeft =
			$threePhase.timeLeft + Number(contracts.contracts.Game.linkedData.revealPhaseDuration); // TODO reuse
		duration =
			$threePhase.duration + Number(contracts.contracts.Game.linkedData.revealPhaseDuration); // TODO reuse
	}
	if ($threePhase.phase === 'reveal') {
		phase = 'wait';
		duration = $threePhase.duration + timeConfig.COMMIT_TIME_ALLOWANCE;
	}
	return {
		phase,
		timeLeft,
		duration
	};
});

(globalThis as any).epochInfo = epochInfo;
(globalThis as any).time = time;
(globalThis as any).threePhase = threePhase;
(globalThis as any).twoPhase = twoPhase;
