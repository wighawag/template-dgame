import { connection } from '$lib/connection';
import { derived, writable } from 'svelte/store';

export type SyncedTime = {
	lastSync?: number;
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
			set({ value: last_time + timePassed / 1000, lastSync: now });
		}, 1000);

		attemptToUpdateTimeUntilSynced();

		return () => clearInterval(interval);
	}

	async function attemptToUpdateTimeUntilSynced() {
		const synced = await updateTimeFromProvider();
		if (!synced) {
			setTimeout(attemptToUpdateTimeUntilSynced, 1000);
		}
	}

	function updateTimeFromFetchedTime(newTime: number, fetchTime: number) {
		last_time = newTime;
		last_fetch_time = fetchTime;
		const now = performance.now();
		const timePassed = now - last_fetch_time;
		set({ value: last_time + timePassed / 1000, lastSync: now });
	}

	async function updateTimeFromProvider() {
		const before_fetch = performance.now();
		const blockResponse = await connection.provider.call('eth_getBlockByNumber')([
			'latest',
			false as true // TODO fix eip-1193 Methods
		]);
		if (blockResponse.success && blockResponse.value) {
			const lastBlockTime = Number(blockResponse.value.timestamp);
			const after_fetch = performance.now();
			const predicted_fetch_time = (before_fetch + after_fetch) / 2;
			updateTimeFromFetchedTime(lastBlockTime, predicted_fetch_time);
			return true;
		}
		return !!$time.lastSync;
	}

	function now() {
		const now = performance.now();
		const timePassed = now - last_fetch_time;
		return last_time + timePassed / 1000;
	}

	return {
		now,
		updateTimeFromFetchedTime,
		updateTimeFromProvider,
		subscribe: time.subscribe
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
			timeLeftForRevealEnd
		};
	}

	return {
		calculateEpochInfo
	};
}

const localComputer = createLocalComputer({
	// TODO get it from Contract Data
	COMMIT_PHASE_DURATION: 13,
	REVEAL_PHASE_DURATION: 4,
	START_TIME: 0
});

// export const epochInfo = derived(time, (t) => localComputer.calculateEpochInfo(t.value));

const _epochInfo = writable<EpochInfo>();

export const epochInfo = {
	subscribe: _epochInfo.subscribe,
	now() {
		return localComputer.calculateEpochInfo(time.now());
	},
	fromTime(now: number) {
		return localComputer.calculateEpochInfo(now);
	}
};

(globalThis as any).epochInfo = epochInfo;
(globalThis as any).time = time;
