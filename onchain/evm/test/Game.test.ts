import {expect} from 'earl';
import {describe, it} from 'node:test'; // using node:test as hardhat v3 do not support vitest
import {network} from 'hardhat';
import {setupFixtures} from './utils/index.js';
import {zeroAddress} from 'viem';

const {provider, networkHelpers} = await network.connect();
const {deployAll} = setupFixtures(provider);

describe('Game', function () {
	it('basic test', async function () {
		const {env, Game, Avatars, unnamedAccounts} = await networkHelpers.loadFixture(deployAll);

		const before_avatars = await env.read(Game, {
			functionName: 'getAvatarsInZone',
			args: [0n, 0n, 100n],
		});

		console.log(before_avatars);

		await env.execute(Avatars, {
			account: env.unnamedAccounts[0],
			functionName: 'mint',
			args: [unnamedAccounts[0], 0n],
		});

		const avatarID = BigInt(unnamedAccounts[0]) << 92n;

		await env.execute(Avatars, {
			account: env.unnamedAccounts[0],
			functionName: 'approve',
			args: [Game.address, avatarID],
		});

		await env.execute(Game, {
			account: env.unnamedAccounts[0],
			functionName: 'enter',
			args: [avatarID, zeroAddress],
		});

		const hash = '0x000000000000000000000000000000000000000000000000';
		const secret = '0x0000000000000000000000000000000000000000000000000000000000000000';
		await env.execute(Game, {
			account: env.unnamedAccounts[0],
			functionName: 'commit',
			args: [avatarID, hash, zeroAddress],
		});

		await env.execute(Game, {
			account: env.unnamedAccounts[0],
			functionName: 'reveal',
			args: [1n, [], secret, zeroAddress],
		});

		const after_avatars = await env.read(Game, {
			functionName: 'getAvatarsInZone',
			args: [0n, 0n, 100n],
		});

		console.log(after_avatars);
	});
});
