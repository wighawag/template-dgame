import {Abi_Avatars} from '@generated/types/Avatars.js';
import {Abi_IGame} from '@generated/types/IGame.js';
import {loadAndExecuteDeployments} from '@rocketh';
import {EthereumProvider} from 'hardhat/types/providers';

export function setupFixtures(provider: EthereumProvider) {
	return {
		async deployAll() {
			const env = await loadAndExecuteDeployments({
				provider: provider,
			});

			const Game = env.get<Abi_IGame>('Game');
			const Avatars = env.get<Abi_Avatars>('Avatars');

			return {env, Game, Avatars, namedAccounts: env.namedAccounts, unnamedAccounts: env.unnamedAccounts};
		},
	};
}
