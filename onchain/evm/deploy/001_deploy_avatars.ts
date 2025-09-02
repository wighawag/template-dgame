import {deployScript, artifacts} from '#rocketh';

export default deployScript(
	async ({get, deploy, namedAccounts}) => {
		const {deployer, admin} = namedAccounts;

		await deploy('Avatars', {
			account: deployer,
			artifact: artifacts.Avatars,
			args: [0n],
		});
	},
	{tags: ['Avatars', 'Avatars_deploy']},
);
