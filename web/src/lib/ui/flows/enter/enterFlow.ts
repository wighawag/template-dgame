import type {
	AvatarCollection,
	AvatarsCollectionStore,
} from '$lib/onchain/avatars';
import type {ViewState} from '$lib/view';
import type {
	Connection,
	ConnectionStore,
	UnderlyingEthereumProvider,
} from '@etherplay/connect';
import type {Position} from 'reveal-or-die-contracts';
import {get, writable, type Readable} from 'svelte/store';
import type {LocalStateStore} from '$lib/private/localState';
import type {PurchaseFlowStore} from '../purchase/purchaseFlow';
import type {EpochInfoStore, TwoPhaseStore} from '$lib/types';

export type EnterFlow = {error?: {message: string}} & (
	| {
			step: 'Idle';
	  }
	| ({position: Position} & (
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
	  ))
);

export function createEnterFlow(params: {
	connection: ConnectionStore<UnderlyingEthereumProvider>;
	viewState: Readable<ViewState>;
	purchaseFlow: PurchaseFlowStore;
	localState: LocalStateStore;
	epochInfo: EpochInfoStore;
	twoPhase: TwoPhaseStore;
	avatars: AvatarsCollectionStore;
}) {
	const {
		connection,
		viewState,
		purchaseFlow,
		localState,
		epochInfo,
		twoPhase,
		avatars,
	} = params;
	let $data: EnterFlow = {step: 'Idle'};
	const store = writable<EnterFlow>($data);

	function set(data: EnterFlow) {
		$data = data;
		store.set($data);
	}

	function onConnectionChanged(
		$connection: Connection<UnderlyingEthereumProvider>,
	) {
		if ($data.step === 'Idle') {
			return;
		}
		if ($data.step === 'RequireSignIn') {
			if ($connection.step === 'SignedIn') {
				setTimeout(() => start(), 1);
			}
		} else {
			if ($connection.step != 'SignedIn') {
				set({step: 'RequireSignIn', position: $data.position});
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
	function start(pos?: Position) {
		// console.log(`start`, pos);
		const $connection = get(connection);
		unsubscribeFromConnection = connection.subscribe(onConnectionChanged);
		unsubscribeFromAvatars = avatars.subscribe(onAvatarsChanged);

		const position =
			pos || ($data.step !== 'Idle' ? $data.position : {x: 0, y: 0});

		if ($connection.step !== 'SignedIn') {
			set({
				step: 'RequireSignIn',
				position,
			});
			return;
		}
		const $avatars = get(avatars);
		if ($avatars.step != 'Loaded') {
			set({step: 'Loading', position});
			return;
		}

		const $viewState = get(viewState);
		if ($viewState.avatar) {
			throw new Error(`avatar already in game : ${$viewState.avatar.id}`);
		}

		// TODO let use with avatars join in
		// if ($avatars.avatarsInWallet.length > 0) {
		//     // show the list of avatars you can already use
		//  set({ step: 'RequireDeposit' });
		// }

		if ($avatars.avatarsOnBench.length > 0) {
			set({step: 'Ready', avatars: $avatars.avatarsOnBench, position});
		} else {
			set({step: 'RequireAvatars', position});
		}
	}

	async function enter(avatarID: bigint) {
		if ($data.step != 'Ready') {
			throw new Error(`need to be ready to enter`);
		}
		const $epochInfo = get(epochInfo);
		const $twoPhase = get(twoPhase);
		let epoch = $epochInfo.currentEpoch;

		if ($twoPhase.phase !== 'play') {
			epoch += 1;
		}
		localState.enter(avatarID, epoch, $data.position);
		set({
			step: 'Idle',
		});
	}

	function cancel() {
		unsubscribeFromConnection?.();
		unsubscribeFromAvatars?.();
		set({step: 'Idle'});
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
		enter,
	};
}

export type EnterFlowStore = ReturnType<typeof createEnterFlow>;
