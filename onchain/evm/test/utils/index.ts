import {Abi_Game} from '@generated/types/Game.js';
import {loadAndExecuteDeployments} from '@rocketh';
import {EthereumProvider} from 'hardhat/types/providers';

export function setupFixtures(provider: EthereumProvider) {
	return {
		async deployAll() {
			const env = await loadAndExecuteDeployments({
				provider: provider,
			});

			const Game = env.get<Abi_Game>('Game');

			return {env, Game, namedAccounts: env.namedAccounts, unnamedAccounts: env.unnamedAccounts};
		},
	};
}
