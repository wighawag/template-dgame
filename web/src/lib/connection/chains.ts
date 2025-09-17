import { parseEther } from 'viem';

export const chains: { [chainID: string]: { blockTime: number; expectedWorstGasPrice: bigint } } = {
	31337: {
		blockTime: 1, // TODO use same value from hardhat config
		expectedWorstGasPrice: parseEther('1', 'gwei') // TODO use same value from hardhat config
	},
	6342: {
		// mega-eth testnet
		blockTime: 1,
		expectedWorstGasPrice: parseEther('0.003', 'gwei')
	},
	50312: {
		// somnia testnet
		blockTime: 1,
		expectedWorstGasPrice: parseEther('10', 'gwei')
	},
	11142220: {
		// celo sepolia testnet
		blockTime: 1,
		expectedWorstGasPrice: parseEther('25', 'gwei')
	},
	216: {
		// happychain testnet
		blockTime: 2,
		expectedWorstGasPrice: parseEther('0.000001', 'gwei')
	}
};

export function getChainParameters(chainID: number | string) {
	const chain = chains[chainID];
	if (chain) {
		return chain;
	}

	// Default
	return {
		blockTime: 12,
		expectedWorstGasPrice: parseEther('100', 'gwei')
	};
}
