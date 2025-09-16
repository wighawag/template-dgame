export const chains: { [chainID: string]: { blockTime: number } } = {
	31337: {
		blockTime: 1 // TODO use env from hardhat
	},
	6342: {
		blockTime: 1
	}
};

export function getChainParameters(chainID: number | string) {
	const chain = chains[chainID];
	if (chain) {
		return chain;
	}

	// Default
	return {
		blockTime: 1
	};
}
