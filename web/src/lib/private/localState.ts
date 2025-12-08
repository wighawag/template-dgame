import { signer, type OptionalSigner, type Signer } from '$lib/core/connection';
import { epochInfo, timeConfig } from '$lib/core/time';
import deployments from '$lib/deployments';
import { createAutoSubmitter, type AutoSubmitConfig } from '$lib/core/utils/operations/auto-submit';
import { writes } from '$lib/onchain/writes';
import type { Position } from 'reveal-or-die-contracts';
import { logs } from 'named-logs';
import { writable, type Readable } from 'svelte/store';
import { keccak256 } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const console = logs('localState');

export type LocalAction = {
	type: string;
};

export type LocalSignedInState = {
	signer: Signer;
	// data?: Data;
	tutorialSeen: boolean;
};
export type LocalReadyState = {
	signer: Signer;
	// data: Data;
	tutorialSeen: boolean;
};
export type LocalState = { signer: undefined } | LocalSignedInState | LocalReadyState;

function defaultState() {
	return {
		signer: undefined
	};
}
const $state: LocalState = defaultState();

function LOCAL_STORAGE_STATE_KEY(signerAddress: `0x${string}`) {
	return `__private__${deployments.chain.id}_${deployments.chain.genesisHash}_${deployments.contracts.Game.address}_${signerAddress}`;
}

export function computeUpdatedLocalState($state: LocalState, epoch: number): LocalState {
	if (!$state.signer) {
		return $state;
	}
	// TODO
	return $state;
}

export function createLocalState(signer: Readable<OptionalSigner>) {
	const _localState = writable<LocalState>($state, start);

	function set(state: LocalState) {
		if ($state != state) {
			const keys = Object.keys(state).concat(Object.keys($state));
			for (const key of keys) {
				($state as any)[key] = (state as any)[key];
			}
		}

		if ($state.signer) {
			try {
				localStorage.setItem(LOCAL_STORAGE_STATE_KEY($state.signer.owner), JSON.stringify($state));
			} catch (err) {
				console.error(`failed to write to local storage`, err);
			}
		}
		_localState.set($state);
		return $state;
	}

	function start() {
		const unsubscribeFromOptionalSigner = signer.subscribe(($signer) => {
			if ($signer?.owner !== $state.signer?.owner) {
				if ($signer) {
					try {
						const fromStorageStr = localStorage.getItem(LOCAL_STORAGE_STATE_KEY($signer.owner));
						if (fromStorageStr) {
							const fromStorage = JSON.parse(fromStorageStr);
							set(fromStorage);
						} else {
							set({ signer: $signer, tutorialSeen: false });
						}
					} catch (err) {
						set({ signer: $signer, tutorialSeen: false });
					}
				} else {
					set({ signer: undefined });
				}
			}
		});
		return unsubscribeFromOptionalSigner;
	}

	function markTutorialAsSeen() {
		if (!$state.signer) {
			return;
		}
		$state.tutorialSeen = true;
		set($state);
	}

	function markTutorialAsUnSeen() {
		if (!$state.signer) {
			return;
		}
		$state.tutorialSeen = false;
		set($state);
	}

	function reset() {
		if (!$state.signer) {
			return;
		}
		// TODO
	}

	return {
		get value() {
			return $state;
		},
		subscribe: _localState.subscribe,
		markTutorialAsSeen,
		markTutorialAsUnSeen,

		reset
	};
}

export const localState = createLocalState(signer);

const highFrequencyInterval = (timeConfig.REVEAL_PHASE_DURATION * 1000) / 30;
// TODO ?

(globalThis as any).localState = localState;
