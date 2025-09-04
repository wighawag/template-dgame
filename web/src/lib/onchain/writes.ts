import { PUBLIC_FAUCET_PRIVATE_KEY } from '$env/static/public';
import { connection, publicClient, walletClient } from '$lib/connection';
import type { LocalAction } from '$lib/view/localState';
import { parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
export type TransactionExecution = { transactionID: string; wait(): Promise<void> };

export class Writes {
	async requestFundFromFaucet() {
		const $connection = await connection.ensureConnected();
		const faucetAccount = privateKeyToAccount(PUBLIC_FAUCET_PRIVATE_KEY as `0x${string}`);
		const hash = await walletClient.sendTransaction({
			account: faucetAccount,
			to: $connection.account.signer.address,
			value: parseEther('0.001')
		});
		return {
			transactionID: hash,
			wait: () => publicClient.waitForTransactionReceipt({ hash })
		};
	}

	enter() {}

	async commit_actions(secret: string, actions: LocalAction[]) {}

	reveal_actions(account: string, secret: string, actions: LocalAction[]) {}
}

export const writes = new Writes();
