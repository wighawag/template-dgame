import { PUBLIC_WALLET_HOST } from '$env/static/public';
import { createConnection } from '@etherplay/connect';
import contracts from '$lib/contracts';
import { viemChainInfoToSwitchChainInfo } from '$lib/utils/ethereum/chains';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { derived } from 'svelte/store';

export const chainId = contracts.chainId;
export const chainInfo = contracts.chainInfo;
export const switchChainInfo = viemChainInfoToSwitchChainInfo(chainInfo);
export const connection = createConnection({
	walletHost: PUBLIC_WALLET_HOST,
	node: {
		chainId,
		url: chainInfo.rpcUrls.default.http[0],
		prioritizeWalletProvider: false
	},
	// alwaysUseCurrentAccount: true,
	autoConnect: true,
	requestSignatureAutomaticallyIfPossible: true
});

export const walletClient = createWalletClient({
	chain: chainInfo,
	transport: custom(connection.provider)
});

export const publicClient = createPublicClient({
	chain: chainInfo,
	transport: custom(connection.provider)
});

export type Signer = { owner: `0x${string}`; address: `0x${string}`; privateKey: `0x${string}` };
export type OptionalSigner = Signer | undefined;

export const signer = derived<typeof connection, OptionalSigner>(connection, ($connection) => {
	return $connection.step === 'SignedIn'
		? {
				owner: $connection.account.address,
				address: $connection.account.signer.address,
				privateKey: $connection.account.signer.privateKey
			}
		: undefined;
});

export type Account = `0x${string}` | undefined;

export const account = derived<typeof connection, Account>(connection, ($connection) => {
	return $connection.step === 'SignedIn'
		? $connection.account.address
		: 'account' in $connection
			? ($connection.account as any)?.address || undefined
			: undefined;
});

(globalThis as any).connection = connection;
(globalThis as any).walletClient = walletClient;
(globalThis as any).publicClient = publicClient;
