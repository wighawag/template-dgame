import { PUBLIC_FAUCET_PRIVATE_KEY } from '$env/static/public';
import { connection, publicClient, walletClient } from '$lib/connection';
import contracts from '$lib/contracts';
import { localState, type LocalAction } from '$lib/private/localState';
import { epochInfo } from '$lib/time';
import { encodeAbiParameters, parseEther, zeroAddress } from 'viem';
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

	async purchaseViaFaucet() {
		const $connection = await connection.ensureConnected();
		const faucetAccount = privateKeyToAccount(PUBLIC_FAUCET_PRIVATE_KEY as `0x${string}`);

		const data = encodeAbiParameters(
			[{ type: 'address' }, { type: 'address' }],
			[$connection.account.address, $connection.account.signer.address]
		);
		const value = BigInt(contracts.contracts.AvatarsSale.linkedData.paymentAmount);
		const stippend = parseEther('0.0003');
		const totalValue = value + stippend;
		const hash = await walletClient.writeContract({
			account: faucetAccount,
			...contracts.contracts.AvatarsSale,
			functionName: 'purchase',
			args: [
				contracts.contracts.Game.address,
				0n /* TODO random 96 bits */,
				data,
				$connection.account.signer.address,
				stippend,
				zeroAddress
			],
			value: totalValue
		});
		return {
			transactionID: hash,
			wait: () => publicClient.waitForTransactionReceipt({ hash })
		};
	}

	async enter(avatarID: bigint) {
		const $connection = await connection.ensureConnected();
		const nativeTokenBalanceResponse = await connection.provider.call('eth_getBalance')([
			$connection.account.signer.address
		]);
		if (!nativeTokenBalanceResponse.success) {
			throw new Error(`cannot get native token balance`);
		}
		if (BigInt(nativeTokenBalanceResponse.value) < parseEther('0.0001')) {
			throw new Error(`cannot enter with too low balance`);
		}
		const location = 0n; // TODO
		const signerAccount = privateKeyToAccount($connection.account.signer.privateKey);
		// TODO pre-enter :localState.enter(avatarID, location);
		const hash = await walletClient.writeContract({
			account: signerAccount,
			...contracts.contracts.Game,
			functionName: 'enter',
			args: [avatarID, location]
		});
		const { currentEpoch: epoch } = epochInfo.now();
		localState.enter(epoch, avatarID, location, hash);
		return {
			transactionID: hash,
			wait: () => publicClient.waitForTransactionReceipt({ hash })
		};
	}

	async commit_actions(secret: string, actions: LocalAction[]) {}

	reveal_actions(account: string, secret: string, actions: LocalAction[]) {}
}

export const writes = new Writes();
