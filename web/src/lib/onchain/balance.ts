import { get, writable, type Readable } from 'svelte/store';
import { publicClient, signer, type OptionalSigner, type Signer } from '$lib/connection';
import { creditsDivider } from '$lib/config';

export type Balance = { error?: { message: string } } & (
	| {
			step: 'Idle';
	  }
	| {
			step: 'Loading';
	  }
	| {
			step: 'Loaded';
			value: bigint;
			credits: number;
	  }
);

function defaultState() {
	return {
		step: 'Idle'
	} as const;
}

export function createBalanceStore(
	signer: Readable<OptionalSigner>,
	options?: {
		fetchInterval?: number;
	}
) {
	const fetchInterval = options?.fetchInterval || 5 * 1000; // 30 minutes

	let $state: Balance = defaultState();
	let $signer = get(signer);

	const _store = writable<Balance>($state, start);
	function set(state: Balance) {
		$state = state;
		_store.set($state);
		return $state;
	}

	async function fetchState($signer: Signer): Promise<boolean> {
		set({
			step: 'Loading'
		});

		// TODO use pagination
		let balance: bigint;
		try {
			balance = await publicClient.getBalance({ address: $signer.address });
		} catch (err) {
			set({
				step: 'Loading',
				error: { message: `failed to fetch balance for ${$signer.address}` }
			});
			return false;
		}

		set({
			step: 'Loaded',
			value: balance,
			credits: Number((balance * 100n) / creditsDivider) / 100
		});
		return true;
	}

	async function fetchContinuously() {
		if ($signer) {
			set({
				step: 'Loading'
			});
		} else {
			set({
				step: 'Idle'
			});
		}
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		if ($signer) {
			let interval = fetchInterval;
			try {
				const success = await fetchState($signer);
				if (!success) {
					interval = 500;
				}
			} finally {
				if (!timeout) {
					timeout = setTimeout(fetchContinuously, interval);
				}
			}
		}
	}

	let unsubscribeFromAccount: (() => void) | undefined;
	let timeout: NodeJS.Timeout | undefined;
	function start() {
		unsubscribeFromAccount = signer.subscribe(async (newSigner) => {
			const signerChanged = $signer?.address != newSigner?.address;

			if (signerChanged) {
				if (newSigner) {
					$signer = { ...newSigner };
					fetchContinuously();
				} else {
					set({ step: 'Idle' });
				}
			}
		});

		fetchContinuously();

		return stop;
	}

	async function update() {
		await fetchContinuously();
		return $state;
	}

	function stop() {
		set(defaultState());

		if (unsubscribeFromAccount) {
			unsubscribeFromAccount();
			unsubscribeFromAccount = undefined;
		}

		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
	}

	return {
		subscribe: _store.subscribe,
		update
	};
}

export const balance = createBalanceStore(signer);

(globalThis as any).balance = balance;
