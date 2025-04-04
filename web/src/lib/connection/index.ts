import { PUBLIC_WALLET_HOST } from '$env/static/public';

import { createConnection } from '@etherplay/connect';

import contractsInfo from '$lib/contracts';

export const chainInfo = contractsInfo.chainInfo;

export const connection = createConnection({
	walletHost: PUBLIC_WALLET_HOST,

	node: {
		chainId: contractsInfo.chainId,
		url: chainInfo.rpcUrls.default.http[0],
		prioritizeWalletProvider: false
	},

	autoConnect: true,

	requestSignatureAutomaticallyIfPossible: true
});

(globalThis as any).connection = connection;
