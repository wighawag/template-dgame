import {execute, artifacts} from '@rocketh';

export default execute(
	async ({deployViaProxy, namedAccounts}) => {
		const {deployer, admin} = namedAccounts;

		await deployViaProxy(
			'Game',
			{
				account: deployer,
				artifact: artifacts.Game,
			},
			{
				owner: admin,
			},
		);
	},
	{tags: ['Game', 'Game_deploy']},
);
