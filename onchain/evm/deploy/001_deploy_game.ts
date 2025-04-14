import {execute, artifacts} from '@rocketh';
import {zeroAddress} from 'viem';

export default execute(
	async ({deployViaProxy, namedAccounts}) => {
		const {deployer, admin} = namedAccounts;

		const config = {
			startTime: 0n,
			commitPhaseDuration: 11n,
			revealPhaseDuration: 5n,
			time: zeroAddress,
		};
		await deployViaProxy(
			'Game',
			{
				account: deployer,
				artifact: artifacts.Game,
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
