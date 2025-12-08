import type { Readable } from 'svelte/store';

export type OnchainState = {
	epoch: number;
};

export type OnChainLayer = Readable<OnchainState>;
