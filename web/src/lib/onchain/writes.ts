import { PUBLIC_FAUCET_PRIVATE_KEY } from '$env/static/public';
import {
	connection,
	paymentConnection,
	paymentPublicClient,
	paymentWalletClient,
	publicClient,
	walletClient
} from '$lib/connection';
import { getChainParameters } from '$lib/connection/chains';
import contracts from '$lib/contracts';
import type { LocalAction } from '$lib/private/localState';
import { generateRandom96BitBigInt } from '$lib/utils/data';
import { xyToBigIntID } from 'dgame-contracts';
import { encodeAbiParameters, keccak256, zeroAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
export type TransactionExecution = { transactionID: string; wait(): Promise<void> };

function actionTypeNameToEnum(actionType: string): number {
	switch (actionType) {
		case 'enter':
			return 0;
		case 'move':
			return 1;
		case 'exit':
			return 2;
		default:
			throw new Error(`unknown action type: ${actionType}`);
	}
}

function fromLocalActionToContractValue(action: LocalAction) {
	return {
		actionType: actionTypeNameToEnum(action.type),
		data: xyToBigIntID(action.x, action.y)
	};
}

const maxActionCost = getChainParameters(connection.chainId).expectedWorstGasPrice * 1_000_000n; // 1_000_000 per action is our limit
const stippend = maxActionCost * 100n; // 100 turn, we need to show
const price = BigInt(contracts.contracts.AvatarsSale.linkedData.paymentAmount);

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

	async purchaseViaFaucet() {
		const $connection = await connection.ensureConnected();
		const faucetAccount = privateKeyToAccount(PUBLIC_FAUCET_PRIVATE_KEY as `0x${string}`);

		const data = encodeAbiParameters(
			[{ type: 'address' }, { type: 'address' }],
			[$connection.account.address, $connection.account.signer.address]
		);

		const totalValue = price + stippend;
		const subID = generateRandom96BitBigInt();
		const avatarID = (BigInt($connection.account.address) << 96n) + subID;
		const hash = await walletClient.writeContract({
			account: faucetAccount,
			...contracts.contracts.AvatarsSale,
			functionName: 'purchase',
			args: [
				contracts.contracts.Game.address,
				subID,
				data,
				$connection.account.signer.address,
				stippend,
				zeroAddress
			],
			value: totalValue
		});
		return {
			avatarID,
			transactionID: hash,
			wait: () => publicClient.waitForTransactionReceipt({ hash })
		};
	}

	async purchaseViaPaymentConnection() {
		const $connection = await connection.ensureConnected();
		paymentConnection.connect(
			{
				type: 'wallet'
			},
			{ doNotStoreLocally: true }
		);
		const $paymentConnection = await paymentConnection.ensureConnected(
			'WalletConnected',
			{
				type: 'wallet'
			},
			{ doNotStoreLocally: true }
		);
		const data = encodeAbiParameters(
			[{ type: 'address' }, { type: 'address' }],
			[$connection.account.address, $connection.account.signer.address]
		);
		const value = price + stippend;
		const subID = generateRandom96BitBigInt();
		const avatarID = (BigInt($connection.account.address) << 96n) + subID;

		console.log({
			address: $paymentConnection.mechanism.address,
			addresses: await paymentWalletClient.getAddresses()
		});
		const hash = await paymentWalletClient.writeContract({
			account: $paymentConnection.mechanism.address,
			...contracts.contracts.AvatarsSale,
			functionName: 'purchase',
			args: [
				contracts.contracts.Game.address,
				subID,
				data,
				$connection.account.signer.address,
				stippend,
				zeroAddress
			],
			value
		});
		return {
			avatarID,
			transactionID: hash,
			wait: () => paymentPublicClient.waitForTransactionReceipt({ hash })
		};
	}

	async commit_actions(avatarID: bigint, secret: `0x${string}`, actions: LocalAction[]) {
		const $connection = await connection.ensureConnected();
		const nativeTokenBalanceResponse = await connection.provider.call('eth_getBalance')([
			$connection.account.signer.address
		]);
		if (!nativeTokenBalanceResponse.success) {
			throw new Error(`cannot get native token balance`);
		}
		if (BigInt(nativeTokenBalanceResponse.value) < maxActionCost * 2n) {
			throw new Error(`cannot commit with too low balance`);
		}
		const signerAccount = privateKeyToAccount($connection.account.signer.privateKey);

		const commitmentHash = keccak256(
			encodeAbiParameters(
				[
					{ type: 'bytes32', name: 'secret' },
					{
						components: [
							{
								name: 'actionType',
								type: 'uint8'
							},
							{
								name: 'data',
								type: 'uint128'
							}
						],
						name: 'actions',
						type: 'tuple[]'
					}
				],
				[secret, actions.map(fromLocalActionToContractValue)]
			)
		).slice(0, 50) as `0x${string}`;

		const transactionID = await walletClient.writeContract({
			account: signerAccount,
			...contracts.contracts.Game,
			functionName: 'commit',
			args: [avatarID, commitmentHash, zeroAddress]
		});
		return {
			transactionID,
			wait: () => publicClient.waitForTransactionReceipt({ hash: transactionID })
		};
	}

	async reveal_actions(avatarID: bigint, secret: `0x${string}`, actions: LocalAction[]) {
		const $connection = await connection.ensureConnected();
		const signerAccount = privateKeyToAccount($connection.account.signer.privateKey);

		const actionsValue = actions.map(fromLocalActionToContractValue);

		const transactionID = await walletClient.writeContract({
			account: signerAccount,
			...contracts.contracts.Game,
			functionName: 'reveal',
			args: [avatarID, actionsValue, secret, zeroAddress]
		});
		return {
			transactionID,
			wait: () => publicClient.waitForTransactionReceipt({ hash: transactionID })
		};
	}
}

export const writes = new Writes();
