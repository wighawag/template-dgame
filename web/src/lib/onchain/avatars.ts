import { get, writable, type Readable } from 'svelte/store';
import { account, publicClient, type Account } from '$lib/connection';
import contracts from '$lib/contracts';

export type AvatarCollection = { error?: { message: string } } & (
	| {
			step: 'Idle';
	  }
	| {
			step: 'Loading';
	  }
	| {
			step: 'Loaded';
			avatars: readonly bigint[];
	  }
);

function defaultState() {
	return {
		step: 'Idle'
	} as const;
}

export function createAvatarCollectionStore(
	account: Readable<Account>
): Readable<AvatarCollection> {
	let $state: AvatarCollection = defaultState();
	let $account = get(account);

	const _store = writable<AvatarCollection>($state, start);
	function set(state: AvatarCollection) {
		$state = state;
		_store.set($state);
		return $state;
	}

	async function fetchState($account: `0x${string}`): Promise<boolean> {
		set({
			step: 'Loading'
		});

		let result: readonly bigint[];
		try {
			result = await publicClient.readContract({
				...contracts.contracts.Avatars,
				functionName: 'tokensOfOwner',
				args: [$account, 0n, 100n] // TODO use pagination
			});
		} catch (err) {
			set({
				step: 'Loading',
				error: { message: `failed to fetch avatars for ${$account}` }
			});
			return false;
		}

		set({
			step: 'Loaded',
			avatars: result
		});
		return true;
	}

	let unsubscribeFromAccount: (() => void) | undefined;
	let timeout: NodeJS.Timeout | undefined;
	function start() {
		unsubscribeFromAccount = account.subscribe(async (newAccount) => {
			const accountChanged = $account != newAccount;

			if (accountChanged) {
				$account = newAccount;
				fetchContinuously();
			}
		});

		async function fetchContinuously() {
			if ($account) {
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
			}
			if ($account) {
				let retryIn = 15000;
				try {
					const success = await fetchState($account);
					if (!success) {
						retryIn = 1000;
					}
				} finally {
					if (!timeout) {
						timeout = setTimeout(fetchContinuously, retryIn);
					}
				}
			}
		}
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		fetchContinuously();

		return stop;
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
		subscribe: _store.subscribe
	};
}

export const avatars = createAvatarCollectionStore(account);

(globalThis as any).avatars = avatars;
