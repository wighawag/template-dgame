import {Abi_Avatars} from '@generated/types/Avatars.js';
import {Abi_IGame} from '@generated/types/IGame.js';
import {execute, artifacts} from '@rocketh';
import {zeroAddress} from 'viem';

export default execute(
	async ({get, deployViaProxy, deployViaRouter, namedAccounts}) => {
		const {deployer, admin} = namedAccounts;

		const Avatars = get<Abi_Avatars>('Avatars');

		const config = {
			startTime: 0n,
			commitPhaseDuration: 12n,
			revealPhaseDuration: 3n,
			time: zeroAddress,
			avatars: Avatars.address,
		};

		const routes = [
			{name: 'Getters', artifact: artifacts.GameGetters, args: [config]},
			{name: 'Commit', artifact: artifacts.GameCommit, args: [config]},
			{name: 'Reveal', artifact: artifacts.GameReveal, args: [config]},
			{name: 'Enter', artifact: artifacts.GameEnter, args: [config]},
			{name: 'Extract', artifact: artifacts.GameExtract, args: [config]},
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
	{tags: ['Game', 'Game_deploy'], dependencies: ['Avatars_deploy']},
);
