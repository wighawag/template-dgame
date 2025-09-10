import { PUBLIC_FAUCET_PRIVATE_KEY } from '$env/static/public';
import { connection, publicClient, walletClient } from '$lib/connection';
import contracts from '$lib/contracts';
import type { LocalAction } from '$lib/private/localState';
import { parseEther, zeroAddress } from 'viem';
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

	async enter() {
		const $connection = await connection.ensureConnected();
		const signerAccount = privateKeyToAccount($connection.account.signer.privateKey);
		const hash = await walletClient.writeContract({
			account: signerAccount,
			...contracts.contracts.Game,
			functionName: 'enter',
			args: [0n, 0n] // TODO
		});
		return {
			transactionID: hash,
			wait: () => publicClient.waitForTransactionReceipt({ hash })
		};
	}

	async commit_actions(secret: string, actions: LocalAction[]) {}

	reveal_actions(account: string, secret: string, actions: LocalAction[]) {}
}

export const writes = new Writes();
