import {deployScript, artifacts} from '../rocketh/deploy.js';

export default deployScript(
	async ({get, deploy, namedAccounts}) => {
		const {deployer, admin} = namedAccounts;

		// `admin` is the MINTER_ADMIN: the only account that can point the mint
		// at a sale. It is immutable, so it is decided here and nowhere else.
		// Wiring the sale itself happens in 020, because the sale does not exist
		// yet at this point - Avatars has to be deployed first for the sale's
		// constructor to take it.
		await deploy('Avatars', {
			account: deployer,
			artifact: artifacts.Avatars,
			args: [admin],
		});
	},
	{tags: ['Avatars', 'Avatars_deploy']},
);
