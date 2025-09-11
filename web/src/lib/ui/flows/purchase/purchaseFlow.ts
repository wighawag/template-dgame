import { writes } from '$lib/onchain/writes';
import { writable } from 'svelte/store';

export type PurchaseFlow = { error?: { message: string } } & (
	| {
			step: 'Idle';
	  }
	| {
			step: 'RequireSignIn';
	  }
	| {
			step: 'Ready';
	  }
	| {
			step: 'ConfirmTransaction';
	  }
	| {
			step: 'PendingTransaction';
			pendingTransaction: `0x${string}`;
	  }
);

function createPurchaseFlow() {
	let $data: PurchaseFlow = { step: 'Idle' };
	const store = writable<PurchaseFlow>($data);

	function set(data: PurchaseFlow) {
		$data = data;
		store.set($data);
	}

	function start() {
		// TODO connection check
		set({ step: 'Ready' });
	}

	async function purchase() {
		console.log(`purchasing...`);
		await writes.purchaseViaFaucet();
	}

	function cancel() {
		set({ step: 'Idle' });
	}

	return {
		subscribe: store.subscribe,
		cancel,
		start,
		purchase
	};
}

export const purchaseFlow = createPurchaseFlow();
