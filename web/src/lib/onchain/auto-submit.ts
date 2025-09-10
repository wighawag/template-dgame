import { epochInfo, time } from '$lib/time';
import { localState } from '$lib/private/localState';

export function createAutoSubmitter() {
	function start() {
		return time.subscribe(($time) => {
			const localData = localState.value;
			if (localData.actions.length == 0) {
				return;
			}

			const $epochInfo = epochInfo.fromTime($time.value);
			if ($epochInfo.isCommitPhase) {
				if ($epochInfo.timeLeftForCommitEnd < 3) {
					if (
						!localData.submission ||
						localData.submission.commit.epoch < $epochInfo.currentEpoch
					) {
						localState.commit();
					} else {
						// already submiited
					}
				} else {
					// still time for player to setup its move
				}
			} else {
				if (localData.submission && localData.submission.commit.epoch == $epochInfo.currentEpoch) {
					if (
						!localData.submission.reveal ||
						localData.submission.reveal.epoch < $epochInfo.currentEpoch
					) {
						localState.reveal();
					} else {
						// already submiited
					}
				}
			}
		});
	}

	return {
		start
	};
}
