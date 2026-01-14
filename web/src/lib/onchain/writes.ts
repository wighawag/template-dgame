import {PUBLIC_FAUCET_PRIVATE_KEY} from '$env/static/public';
import type {DeploymentsStore} from '$lib/core/connection/types';
import type {Costs} from '$lib/core/connection/costs';
import type {GasFeeStore} from '$lib/core/connection/gasFee';
import deploymentsFromFiles from '$lib/deployments';

import {generateRandom96BitBigInt} from '$lib/core/utils/data';
import type {LocalAction} from '$lib/private/localState';
import type {
	ConnectionStore,
	UnderlyingEthereumProvider,
} from '@etherplay/connect';
import {xyToBigIntID} from 'reveal-or-die-contracts';
import {get, type Readable} from 'svelte/store';
import {
	encodeAbiParameters,
	formatEther,
	keccak256,
	zeroAddress,
	type CustomTransport,
	type PublicClient,
	type WalletClient,
} from 'viem';
import {privateKeyToAccount} from 'viem/accounts';
export type TransactionExecution = {
	transactionID: string;
	wait(): Promise<void>;
};

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
		data: xyToBigIntID(action.x, action.y),
	};
}

export function createWriteOperations(params: {
	costs: Readable<Costs>;
	connection: ConnectionStore<UnderlyingEthereumProvider>;
	walletClient: WalletClient<
		CustomTransport,
		typeof deploymentsFromFiles.chain
	>;
	publicClient: PublicClient<
		CustomTransport,
		typeof deploymentsFromFiles.chain
	>;
	paymentWalletClient: WalletClient<
		CustomTransport,
		typeof deploymentsFromFiles.chain
	>;
	paymentPublicClient: PublicClient<
		CustomTransport,
		typeof deploymentsFromFiles.chain
	>;
	gasFee: GasFeeStore;
	paymentConnection: ConnectionStore<UnderlyingEthereumProvider>;
	deployments: DeploymentsStore;
}) {
	const {
		costs,
		connection,
		walletClient,
		publicClient,
		paymentPublicClient,
		paymentWalletClient,
		gasFee,
		paymentConnection,
		deployments: deploymentsStore,
	} = params;

	async function requestFundFromFaucet() {
		// TODO remove get, add a current field to CostStore
		const currentCosts = get(costs);
		const $connection = await connection.ensureConnected();
		const faucetAccount = privateKeyToAccount(
			PUBLIC_FAUCET_PRIVATE_KEY as `0x${string}`,
		);
		const hash = await walletClient.sendTransaction({
			account: faucetAccount,
			to: $connection.account.signer.address,
			value: currentCosts.price + currentCosts.stippend,
		});
		return {
			transactionID: hash,
			wait: () => publicClient.waitForTransactionReceipt({hash}),
		};
	}

	async function purchaseViaFaucet() {
		const deployments = deploymentsStore.current;
		// TODO remove get, add a current field to CostStore
		const currentCosts = get(costs);
		const $connection = await connection.ensureConnected();
		const faucetAccount = privateKeyToAccount(
			PUBLIC_FAUCET_PRIVATE_KEY as `0x${string}`,
		);

		const data = encodeAbiParameters(
			[{type: 'address'}, {type: 'address'}],
			[$connection.account.address, $connection.account.signer.address],
		);

		const totalValue = currentCosts.price + currentCosts.stippend;
		console.log(`sending ${formatEther(totalValue)} native tokens along...`);
		const subID = generateRandom96BitBigInt();
		const avatarID = (BigInt($connection.account.address) << 96n) + subID;

		// -------------------------------------------------
		// required on somnia
		// -------------------------------------------------
		if ((deployments.chain as any).id === 50312) {
			const transactionCount = await publicClient.getTransactionCount({
				address: $connection.account.signer.address,
			});
			const balance = await publicClient.getBalance({
				address: $connection.account.signer.address,
			});
			if (balance == 0n && transactionCount == 0) {
				const account_creation_hash = await walletClient.sendTransaction({
					to: $connection.account.signer.address,
					value: 1n,
					account: faucetAccount,
					maxFeePerGas: BigInt(
						deployments.chain.properties.expectedWorstGasPrice,
					),
				});
				await publicClient.waitForTransactionReceipt({
					hash: account_creation_hash,
				});
			}
		}
		// -------------------------------------------------

		// const simulation = await publicClient.simulateContract({
		// 	account: faucetAccount,
		// 	...deployments.contracts.AvatarsSale,
		// 	functionName: 'purchase',
		// 	args: [
		// 		deployments.contracts.Game.address,
		// 		subID,
		// 		data,
		// 		$connection.account.signer.address,
		// 		stippend,
		// 		zeroAddress
		// 	],
		// 	value: totalValue
		// });
		const hash = await walletClient.writeContract({
			account: faucetAccount,
			...deployments.contracts.AvatarsSale,
			functionName: 'purchase',
			args: [
				deployments.contracts.Game.address,
				subID,
				data,
				$connection.account.signer.address,
				currentCosts.stippend,
				zeroAddress,
			],
			value: totalValue,
		});
		return {
			avatarID,
			transactionID: hash,
			wait: () => publicClient.waitForTransactionReceipt({hash}),
		};
	}

	async function purchaseViaPaymentConnection() {
		const deployments = deploymentsStore.current;
		// TODO remove get, add a current field to CostStore
		const currentCosts = get(costs);
		const $connection = await connection.ensureConnected();
		paymentConnection.connect(
			{
				type: 'wallet',
			},
			{doNotStoreLocally: true},
		);
		const $paymentConnection = await paymentConnection.ensureConnected(
			'WalletConnected',
			{
				type: 'wallet',
			},
			{doNotStoreLocally: true},
		);
		const data = encodeAbiParameters(
			[{type: 'address'}, {type: 'address'}],
			[$connection.account.address, $connection.account.signer.address],
		);
		const value = currentCosts.price + currentCosts.stippend;
		const subID = generateRandom96BitBigInt();
		const avatarID = (BigInt($connection.account.address) << 96n) + subID;

		console.log({
			address: $paymentConnection.mechanism.address,
			addresses: await paymentWalletClient.getAddresses(),
		});
		const hash = await paymentWalletClient.writeContract({
			account: $paymentConnection.mechanism.address,
			...deployments.contracts.AvatarsSale,
			functionName: 'purchase',
			args: [
				deployments.contracts.Game.address,
				subID,
				data,
				$connection.account.signer.address,
				currentCosts.stippend,
				zeroAddress,
			],
			value,
			maxFeePerGas: BigInt(deployments.chain.properties.expectedWorstGasPrice),
		});
		return {
			avatarID,
			transactionID: hash,
			wait: () => paymentPublicClient.waitForTransactionReceipt({hash}),
		};
	}

	async function commit_actions(
		avatarID: bigint,
		secret: `0x${string}`,
		actions: LocalAction[],
		options?: {pollingInterval?: number},
	) {
		const deployments = deploymentsStore.current;
		// TODO remove get, add a current field to CostStore
		const currentCosts = get(costs);
		const $connection = await connection.ensureConnected();
		const nativeTokenBalanceResponse = await connection.provider.call(
			'eth_getBalance',
		)([$connection.account.signer.address, 'latest'] as any); // TODO fix eip-1193
		if (!nativeTokenBalanceResponse.success) {
			throw new Error(`cannot get native token balance`);
		}
		if (
			BigInt(nativeTokenBalanceResponse.value) <
			currentCosts.maxActionCost * 2n
		) {
			throw new Error(
				`cannot commit with too low balance: ${formatEther(BigInt(nativeTokenBalanceResponse.value))} < ${formatEther(currentCosts.maxActionCost * 2n)}`,
			);
		}
		const signerAccount = privateKeyToAccount(
			$connection.account.signer.privateKey,
		);

		const commitmentHash = keccak256(
			encodeAbiParameters(
				[
					{type: 'bytes32', name: 'secret'},
					{
						components: [
							{
								name: 'actionType',
								type: 'uint8',
							},
							{
								name: 'data',
								type: 'uint128',
							},
						],
						name: 'actions',
						type: 'tuple[]',
					},
				],
				[secret, actions.map(fromLocalActionToContractValue)],
			),
		).slice(0, 50) as `0x${string}`;

		// const estimate = await publicClient.estimateContractGas({
		// 	account: signerAccount,
		// 	...contracts.contracts.Game,
		// 	functionName: 'commit',
		// 	args: [avatarID, commitmentHash, zeroAddress],
		// 	gas: 10_000_000n
		// });

		// const currentBalance = get(balance);
		// if (currentBalance.step !== 'Loaded') {
		// 	throw new Error(`balance unknown`);
		// }
		// if (estimate > currentBalance.value) {
		// 	throw new Error(
		// 		`balance too low: ${formatEther(estimate)} > ${formatEther(currentBalance.value)}`
		// 	);
		// }

		const currentGasFee = gasFee.value;

		if (!currentGasFee) {
			throw new Error(`no gas fee avaiulable yet`);
		}

		if (deployments.chain.properties.supportsSendRawTransactionSync) {
			const receipt = await walletClient.writeContractSync({
				account: signerAccount,
				...deployments.contracts.Game,
				functionName: 'commit',
				args: [avatarID, commitmentHash, zeroAddress],
				maxFeePerGas: currentGasFee.average.maxFeePerGas,
				maxPriorityFeePerGas: currentGasFee.average.maxPriorityFeePerGas,
				gas: currentCosts.maxCommitGas,
			});
			return {
				transactionID: receipt.transactionHash,
				wait: async () => {
					return receipt;
				},
			};
		} else {
			const txHash = await walletClient.writeContract({
				account: signerAccount,
				...deployments.contracts.Game,
				functionName: 'commit',
				args: [avatarID, commitmentHash, zeroAddress],
				maxFeePerGas: currentGasFee.average.maxFeePerGas,
				maxPriorityFeePerGas: currentGasFee.average.maxPriorityFeePerGas,
				gas: currentCosts.maxCommitGas,
			});
			return {
				transactionID: txHash,
				wait: () => {
					return publicClient.waitForTransactionReceipt({
						hash: txHash,
						pollingInterval: options?.pollingInterval,
					});
				},
			};
		}
	}

	async function reveal_actions(
		avatarID: bigint,
		secret: `0x${string}`,
		actions: LocalAction[],
		options?: {pollingInterval?: number},
	) {
		const deployments = deploymentsStore.current;
		// TODO remove get, add a current field to CostStore
		const currentCosts = get(costs);
		const $connection = await connection.ensureConnected();
		const signerAccount = privateKeyToAccount(
			$connection.account.signer.privateKey,
		);

		const actionsValue = actions.map(fromLocalActionToContractValue);

		// const estimate = await publicClient.estimateContractGas({
		// 	account: signerAccount,
		// 	...contracts.contracts.Game,
		// 	functionName: 'reveal',
		// 	args: [avatarID, actionsValue, secret, zeroAddress]
		// });

		// const currentBalance = get(balance);
		// if (currentBalance.step !== 'Loaded') {
		// 	throw new Error(`balance unknown`);
		// }
		// if (estimate > currentBalance.value) {
		// 	throw new Error(
		// 		`balance too low: ${formatEther(estimate)} > ${formatEther(currentBalance.value)}`
		// 	);
		// }

		const currentGasFee = gasFee.value;

		if (!currentGasFee) {
			throw new Error(`no gas fee avaiulable yet`);
		}

		if (deployments.chain.properties.supportsSendRawTransactionSync) {
			const receipt = await walletClient.writeContractSync({
				account: signerAccount,
				...deployments.contracts.Game,
				functionName: 'reveal',
				args: [avatarID, actionsValue, secret, zeroAddress],
				maxFeePerGas: currentGasFee.average.maxFeePerGas,
				maxPriorityFeePerGas: currentGasFee.average.maxPriorityFeePerGas,
				gas: currentCosts.maxRevealGas,
			});
			return {
				transactionID: receipt.transactionHash,
				wait: async () => {
					return receipt;
				},
			};
		} else {
			const txHash = await walletClient.writeContract({
				account: signerAccount,
				...deployments.contracts.Game,
				functionName: 'reveal',
				args: [avatarID, actionsValue, secret, zeroAddress],
				maxFeePerGas: currentGasFee.average.maxFeePerGas,
				maxPriorityFeePerGas: currentGasFee.average.maxPriorityFeePerGas,
				gas: currentCosts.maxRevealGas,
			});
			return {
				transactionID: txHash,
				wait: () => {
					return publicClient.waitForTransactionReceipt({
						hash: txHash,
						pollingInterval: options?.pollingInterval,
					});
				},
			};
		}
	}

	return {
		commit_actions,
		reveal_actions,
		purchaseViaFaucet,
		purchaseViaPaymentConnection,
		requestFundFromFaucet,
	};
}

export type WriteOperations = ReturnType<typeof createWriteOperations>;
