import { PUBLIC_FAUCET_PRIVATE_KEY } from '$env/static/public';
import { price, stippend } from '$lib/core/config';
import { connection, publicClient, walletClient } from '$lib/core/connection';
import { privateKeyToAccount } from 'viem/accounts';
export type TransactionExecution = { transactionID: string; wait(): Promise<void> };

export class Writes {
	async requestFundFromFaucet() {
		const $connection = await connection.ensureConnected();
		const faucetAccount = privateKeyToAccount(PUBLIC_FAUCET_PRIVATE_KEY as `0x${string}`);
		const hash = await walletClient.sendTransaction({
			account: faucetAccount,
			to: $connection.account.signer.address,
			value: price + stippend
		});
		return {
			transactionID: hash,
			wait: () => publicClient.waitForTransactionReceipt({ hash })
		};
	}
}

export const writes = new Writes();
