import {Abi_IGame} from '@generated/types/IGame.js';
import {execute, artifacts} from '@rocketh';
import {zeroAddress} from 'viem';

export default execute(
	async ({deployViaProxy, deployViaRouter, namedAccounts}) => {
		const {deployer, admin} = namedAccounts;

		const config = {
			startTime: 0n,
			commitPhaseDuration: 11n,
			revealPhaseDuration: 5n,
			time: zeroAddress,
		};

		const routes = [
			{name: 'Getters', artifact: artifacts.GameGetters, args: [config]},
			{name: 'Commit', artifact: artifacts.GameCommit, args: [config]},
			{name: 'Reveal', artifact: artifacts.GameReveal, args: [config]},
		];

		const Game = await deployViaProxy<Abi_IGame>(
			'Game',
			{
				account: deployer,
				artifact: (name, params) => {
					return deployViaRouter<Abi_IGame>(name, params, routes);
				},
				args: [config],
			},
			{
				owner: admin,
				linkedData: config,
			},
		);
	},
	{tags: ['Game', 'Game_deploy']},
);
