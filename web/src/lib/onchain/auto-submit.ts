import { epochInfo, time } from '$lib/time';
import { localState } from '$lib/private/localState';

export function createAutoSubmitter() {
	function start() {
		return time.subscribe(($time) => {
			const localData = localState.value;
			if (!localData.signer) {
				return;
			}
			if (!localData.avatar) {
				return;
			}

			if (localData.avatar.actions.length == 0) {
				return;
			}

			const $epochInfo = epochInfo.fromTime($time.value);
			if ($epochInfo.isCommitPhase) {
				if ($epochInfo.timeLeftForCommitEnd < 3) {
					if (
						!localData.avatar.submission ||
						localData.avatar.submission.commit.epoch < $epochInfo.currentEpoch
					) {
						localState.commit();
					} else {
						// already submiited
					}
				} else {
					// still time for player to setup its move
				}
			} else {
				if (
					localData.avatar.submission &&
					localData.avatar.submission.commit.epoch == $epochInfo.currentEpoch
				) {
					if (
						!localData.avatar.submission.reveal ||
						localData.avatar.submission.reveal.epoch < $epochInfo.currentEpoch
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
