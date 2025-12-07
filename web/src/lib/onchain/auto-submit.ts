import { epochInfo, time, timeConfig, type EpochInfo } from '$lib/time';
import { type Unsubscriber } from 'svelte/store';
import { logs } from 'named-logs';

const console = logs('auto-submit');

export type AutoSubmitConfig = {
	/**
	 * Function to execute the submission
	 */
	execute: () => void;

	/**
	 * Function to determine if the submission should be executed (called at high frequency)
	 */
	shouldExecute: (params: {
		currentEpochInfo: EpochInfo;
	}) => boolean;

	/**
	 * Function to get the timing for when to start high-frequency checking
	 */
	getTiming: (params: {
		currentEpochInfo: EpochInfo;
	}) => { shouldStart: boolean; delayMs: number, highFrequencyInterval: number };
};

export function createAutoSubmitter(config: AutoSubmitConfig) {
	let highFreqInterval: NodeJS.Timeout | null = null;
	let startTimeout: NodeJS.Timeout | null = null;

	function performHighFrequencyCheck() {
		const now = time.now();
		const currentEpochInfo = epochInfo.fromTime(now);

		if (config.shouldExecute({ currentEpochInfo })) {
			config.execute();
			clearTimers();
			return true;
		}
		clearTimers();
		return false;
	}

	function startHighFrequencyCheck(delayMs: number, interval: number) {
		console.debug(`Starting high-frequency check in ${delayMs}ms`);

		startTimeout = setTimeout(() => {
			// Execute immediately first
			performHighFrequencyCheck();

			// Then continue with interval for subsequent checks
			highFreqInterval = setInterval(performHighFrequencyCheck, interval);
		}, delayMs);
	}

	let unsubscribe: Unsubscriber;
	function start() {
		unsubscribe = time.subscribe(($time) => {
			const $epochInfo = epochInfo.fromTime($time.value);

			const { shouldStart, delayMs, highFrequencyInterval } = config.getTiming({
				currentEpochInfo: $epochInfo,
			});

			if (shouldStart && !highFreqInterval && !startTimeout) {
				startHighFrequencyCheck(delayMs, highFrequencyInterval);
			} else if (!shouldStart) {
				clearTimers();
			}
		});

		return () => {
			unsubscribe();
			clearTimers();
		};
	}

	function stop() {
		if (unsubscribe) {
			unsubscribe();
		}
		clearTimers();
	}

	function clearTimers() {
		if (highFreqInterval) {
			clearInterval(highFreqInterval);
			highFreqInterval = null;
		}
		if (startTimeout) {
			clearTimeout(startTimeout);
			startTimeout = null;
		}
	}

	return {
		start,
		stop
	};
}
