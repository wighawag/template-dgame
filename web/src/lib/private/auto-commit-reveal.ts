import {
	createAutoSubmitter,
	type AutoSubmitConfig,
} from '$lib/core/utils/operations/auto-submit';
import type {SyncedTimeStore} from '$lib/core/time';
import {get} from 'svelte/store';
import {computeUpdatedLocalState, type LocalStateStore} from './localState';
import type {EpochConfigStore, EpochInfoStore} from '$lib/types';

export function createAutoSubmitterWithGameConfig(params: {
	epochConfig: EpochConfigStore;
	localState: LocalStateStore;
	epochInfo: EpochInfoStore;
	syncedTime: SyncedTimeStore;
}) {
	const {epochConfig, localState, epochInfo, syncedTime} = params;

	// TODO remove get and make it dynamic
	const $epochConfig = get(epochConfig);
	const highFrequencyInterval = ($epochConfig.revealPhaseDuration * 1000) / 30;

	// Commit auto-submitter configuration
	const commitConfig: AutoSubmitConfig = {
		name: 'auto-commit',
		execute: () => {
			localState.commit({pollingInterval: highFrequencyInterval});
		},
		shouldExecute: ({currentEpochInfo}) => {
			const currentLocalData = computeUpdatedLocalState(
				localState.value,
				currentEpochInfo.currentEpoch,
			);

			if (!currentLocalData.signer || !currentLocalData.avatar) {
				return false;
			}

			return (
				currentEpochInfo.isCommitPhase &&
				!currentLocalData.avatar.submission &&
				!(
					currentLocalData.avatar.exiting &&
					currentLocalData.avatar.actions.length == 0
				) &&
				currentLocalData.avatar.epoch == currentEpochInfo.currentEpoch
			);
		},
		getTiming: ({currentEpochInfo}) => {
			if (currentEpochInfo.type === 'manual') {
				throw new Error(`switched to manual epoch, cannot proceed`);
			}
			const currentLocalData = computeUpdatedLocalState(
				localState.value,
				currentEpochInfo.currentEpoch,
			);
			if (!currentLocalData.signer || !currentLocalData.avatar) {
				return {shouldStart: false, delayMs: 0, highFrequencyInterval};
			}

			// For commit: check if we need to start high-frequency checking 1 second before commit time
			const timeToCommit =
				currentEpochInfo.timeLeftForCommitEnd -
				$epochConfig.commitTimeAllowance;

			const shouldStartCommitCheck =
				currentEpochInfo.isCommitPhase &&
				!currentLocalData.avatar.submission &&
				currentLocalData.avatar.epoch == currentEpochInfo.currentEpoch &&
				timeToCommit <= 1.0; // Within 1 second of commit time

			return {
				shouldStart: shouldStartCommitCheck,
				delayMs: shouldStartCommitCheck
					? Math.max(0, (timeToCommit + 0.1) * 1000)
					: 0,
				highFrequencyInterval,
			};
		},
	};

	const commitAutoSubmitter = createAutoSubmitter(
		{syncedTime, epochInfo},
		commitConfig,
	);

	// Reveal auto-submitter configuration
	const revealConfig: AutoSubmitConfig = {
		name: 'auto-reveal',
		execute: () => {
			localState
				.reveal({pollingInterval: highFrequencyInterval})
				.catch((err) => {
					const currentLocalData = localState.value;

					if (
						currentLocalData.signer &&
						currentLocalData.avatar &&
						currentLocalData.avatar.actions.length > 0 &&
						currentLocalData.avatar.actions[
							currentLocalData.avatar.actions.length - 1
						].type == 'enter'
					) {
						console.log(`deleting avatar after reveal failure...`);
						localState.removeAvatar();
					}
				});
		},
		shouldExecute: ({currentEpochInfo}) => {
			const currentLocalData = computeUpdatedLocalState(
				localState.value,
				currentEpochInfo.currentEpoch,
			);
			if (!currentLocalData.signer || !currentLocalData.avatar) {
				return false;
			}

			if (!currentEpochInfo.isCommitPhase) {
				// TODO ?
				// if (!currentLocalData.avatar.submission.commit.includedInBlock) {
				// 	const receipt = await publicClient.getTransactionReceipt({ hash: currentLocalData.avatar.submission.commit.txHash as `0x${string}` });

				// }

				if (
					currentLocalData.avatar.submission &&
					currentLocalData.avatar.submission.commit.epoch ==
						currentEpochInfo.currentEpoch
					// &&
					// currentLocalData.avatar.submission.commit.includedInBlock
				) {
					if (
						!currentLocalData.avatar.submission.reveal ||
						currentLocalData.avatar.submission.reveal.epoch <
							currentEpochInfo.currentEpoch
					) {
						return true;
					} else {
						console.log(`already reveal, retrying`);
						// try resubmission
						return true;
					}
				} else {
					console.log(`no commit found`);
					// Handle avatar removal if commit was not performed
					if (
						currentLocalData.avatar.epoch == currentEpochInfo.currentEpoch &&
						currentLocalData.avatar.actions.length > 0 &&
						currentLocalData.avatar.actions[
							currentLocalData.avatar.actions.length - 1
						].type == 'enter'
					) {
						console.log(`deleting avatar...`);
						localState.removeAvatar();
					}
					// Stop checking if conditions no longer met

					return false;
				}
			} else {
				console.log(`not in reveal phase anymore`);
				// Stop checking if not in reveal phase anymore
				return false;
			}
		},
		getTiming: ({currentEpochInfo}) => {
			if (currentEpochInfo.type === 'manual') {
				throw new Error(`switched to manual epoch, cannot proceed`);
			}
			const currentLocalData = computeUpdatedLocalState(
				localState.value,
				currentEpochInfo.currentEpoch,
			);
			if (!currentLocalData.signer || !currentLocalData.avatar) {
				return {shouldStart: false, delayMs: 0, highFrequencyInterval};
			}

			// For reveal: check if we need to start high-frequency checking 1 second before reveal time
			const shouldStartRevealCheck =
				(!currentLocalData.avatar.submission?.reveal ||
					currentLocalData.avatar.submission.reveal.epoch <
						currentEpochInfo.currentEpoch) &&
				(!currentEpochInfo.isCommitPhase ||
					currentEpochInfo.timeLeftForCommitEnd <= 1.0); // Within 1 second of reveal time

			return {
				shouldStart: shouldStartRevealCheck,
				delayMs: shouldStartRevealCheck
					? currentEpochInfo.isCommitPhase
						? (currentEpochInfo.timeLeftForCommitEnd + 0.1) * 1000
						: 100
					: 0,
				highFrequencyInterval,
			};
		},
	};

	const revealAutoSubmitter = createAutoSubmitter(
		{syncedTime, epochInfo},
		revealConfig,
	);

	return {commitAutoSubmitter, revealAutoSubmitter};
}
