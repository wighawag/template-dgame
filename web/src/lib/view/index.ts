import { onchainState } from '$lib/onchain/state';
import { derived, get } from 'svelte/store';
import { computeUpdatedLocalState, localState } from '../private/localState';

export type ViewState = {
	epoch: number;
};

export const viewState = derived(
	[onchainState, localState],
	([$onchainState, localStateFromStore]): ViewState => {
		const epoch = $onchainState.epoch;
		const $localState = computeUpdatedLocalState(localStateFromStore, epoch);

		return {
			epoch: $onchainState.epoch
		};
	}
);

(globalThis as any).viewState = viewState;
(globalThis as any).get = get;
