import { epochInfo, timeConfig, type EpochInfo } from '$lib/core/time';
import { localState, type LocalReadyState, type LocalState } from '$lib/private/localState';
import { eventEmitter } from '$lib/render/eventEmitter';
import { viewState, type ViewState } from '$lib/view';
import { get } from 'svelte/store';

type ReadyState = {
	step: 'Ready';
	epoch: number;
	$viewState: ViewState;
	$localState: LocalReadyState;
	$epochInfo: EpochInfo;
	timeup: boolean;
};
type CurrentState =
	| {
			step: 'Idle';
			$viewState: ViewState;
			$localState: LocalState;
			$epochInfo: EpochInfo;
			timeup: boolean;
	  }
	| ReadyState;

function gatherState(): CurrentState {
	const $epochInfo = epochInfo.now();
	const { currentEpoch: epoch } = $epochInfo;

	const timeup =
		!$epochInfo.isCommitPhase ||
		$epochInfo.timeLeftInPhase < timeConfig.COMMIT_TIME_ALLOWANCE - 0.2;

	const $localState = get(localState);
	const $viewState = get(viewState);

	return {
		step: 'Idle',
		$viewState,
		$localState,
		$epochInfo,
		timeup
	};
}

export function startListening() {
	eventEmitter.on('clicked', (pos) => {
		// TODO
	});
}

export function stopListening() {
	eventEmitter.removeAllListeners();
}
