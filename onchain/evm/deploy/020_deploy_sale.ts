import {deployScript, artifacts} from '#rocketh';
import {parseEther} from 'viem';

export default deployScript(
	async ({get, deployViaProxy, namedAccounts, data}) => {
		const {deployer, admin} = namedAccounts;

		const config = {
			paymentAmount: data.sale.price,
			recipient: admin,
			freeMapAdmin: admin,
		};
		const Avatars = get('Avatars');
		await deployViaProxy(
			'AvatarsSale',
			{
				account: deployer,
				artifact: artifacts.AvatarsSale,
				args: [Avatars.address, config],
			},
			{
				owner: admin,
				linkedData: config,
			},
		);
	},
	{tags: ['AvatarsSale', 'AvatarsSale_deploy']},
);
