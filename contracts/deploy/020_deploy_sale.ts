import {deployScript, artifacts} from '../rocketh/deploy.js';
import {Abi_Avatars} from '../generated/abis/Avatars.js';

export default deployScript(
	async ({get, deployViaProxy, deploy, execute, read, namedAccounts, data}) => {
		const {deployer, admin} = namedAccounts;
		const config = {
			paymentAmount: data.sale.price,
			recipient: admin,
			freeMapAdmin: admin,
		};
		const Avatars = get<Abi_Avatars>('Avatars');
		const AvatarsSale = await deployViaProxy(
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

		// THE MINT IS CLOSED UNTIL THIS RUNS. `Avatars.minter` is zero on a fresh
		// deployment and zero means nobody can mint, so this is what makes the
		// game playable at all - and it is the line that makes an avatar cost
		// something, because the sale is then the only route to one.
		//
		// Pointed at the PROXY, not the implementation, so upgrading the sale
		// does not need re-wiring. Idempotent because deploy scripts re-run: the
		// read costs nothing and the write would otherwise be a transaction on
		// every deploy.
		const currentMinter = await read(Avatars, {functionName: 'minter'});
		if (currentMinter.toLowerCase() !== AvatarsSale.address.toLowerCase()) {
			await execute(Avatars, {
				account: admin,
				functionName: 'setMinter',
				args: [AvatarsSale.address],
			});
		}
	},
	{tags: ['AvatarsSale', 'AvatarsSale_deploy']},
);
