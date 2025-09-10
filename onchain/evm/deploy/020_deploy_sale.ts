import {deployScript, artifacts} from '#rocketh';
import {parseEther} from 'viem';

export default deployScript(
	async ({get, deployViaProxy, namedAccounts}) => {
		const {deployer, admin} = namedAccounts;

		const Avatars = get('Avatars');
		await deployViaProxy(
			'AvatarsSale',
			{
				account: deployer,
				artifact: artifacts.AvatarsSale,
				args: [
					Avatars.address,
					{
						paymentAmount: parseEther('0.01'),
						recipient: admin,
						freeMapAdmin: admin,
					},
				],
			},
			{
				owner: admin,
			},
		);
	},
	{tags: ['AvatarsSale', 'AvatarsSale_deploy']},
);
