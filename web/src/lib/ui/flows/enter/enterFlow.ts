import { connection } from '$lib/connection';
import { avatars, type AvatarCollection } from '$lib/onchain/avatars';
import { writes } from '$lib/onchain/writes';
import type { Connection } from '@etherplay/connect';
import { get, writable } from 'svelte/store';
import { purchaseFlow } from '../purchase/purchaseFlow';

export type EnterFlow = { error?: { message: string } } & (
	| {
			step: 'Idle';
	  }
	| {
			step: 'Loading';
	  }
	| {
			step: 'RequireSignIn';
	  }
	| {
			step: 'RequireAvatars';
	  }
	| {
			step: 'RequireDeposit';
	  }
	| {
			step: 'Ready';
			avatars: readonly bigint[];
			pendingTransaction?: `0x${string}`;
	  }
);

function createEnterFlow() {
	let $data: EnterFlow = { step: 'Idle' };
	const store = writable<EnterFlow>($data);

	function set(data: EnterFlow) {
		$data = data;
		store.set($data);
	}

	// TODO any fix @etherplay/connect
	function onConnectionChanged($connection: Connection<any>) {
		if ($data.step === 'RequireSignIn') {
			if ($connection.step === 'SignedIn') {
				setTimeout(() => start(), 1);
			}
		} else {
			if ($connection.step != 'SignedIn') {
				set({ step: 'RequireSignIn' });
			}
		}
	}

	function onAvatarsChanged($avatars: AvatarCollection) {
		if ($avatars.step === 'Loaded') {
			if ($data.step === 'Loading') {
				setTimeout(() => start(), 1);
			}
		}
	}

	let unsubscribeFromConnection: (() => void) | undefined;
	let unsubscribeFromAvatars: (() => void) | undefined;
	function start() {
		const $connection = get(connection);
		unsubscribeFromConnection = connection.subscribe(onConnectionChanged);
		unsubscribeFromAvatars = avatars.subscribe(onAvatarsChanged);

		if ($connection.step !== 'SignedIn') {
			set({ step: 'RequireSignIn' });
			return;
		}
		const $avatars = get(avatars);
		if ($avatars.step != 'Loaded') {
			set({ step: 'Loading' });
			return;
		}

		if ($avatars.avatarsInGame.length > 0) {
			throw new Error(`avatar already in game`);
		}

		// TODO let use with avatars join in
		// if ($avatars.avatarsInWallet.length > 0) {
		//     // show the list of avatars you can already use
		//  set({ step: 'RequireDeposit' });
		// }

		if ($avatars.avatarsOnBench.length > 0) {
			set({ step: 'Ready', avatars: $avatars.avatarsOnBench });
		} else {
			set({ step: 'RequireAvatars' });
		}
	}

	async function enter(avatarID: bigint) {
		await writes.enter(avatarID);
	}

	function cancel() {
		unsubscribeFromConnection?.();
		unsubscribeFromAvatars?.();
		set({ step: 'Idle' });
	}

	async function startPurchaseFlow() {
		await purchaseFlow.start();
		setTimeout(start, 1);
	}

	return {
		subscribe: store.subscribe,
		cancel,
		start,
		startPurchaseFlow,
		enter
	};
}

export const enterFlow = createEnterFlow();
