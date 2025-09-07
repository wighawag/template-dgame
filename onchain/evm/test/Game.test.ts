import {expect} from 'earl';
import {describe, it} from 'node:test'; // using node:test as hardhat v3 do not support vitest
import {network} from 'hardhat';
import {setupFixtures} from './utils/index.js';
import {zeroAddress} from 'viem';

const {provider, networkHelpers} = await network.connect();
const {deployAll} = setupFixtures(provider);

describe('Game', function () {
	it('basic test', async function () {
		const {env, Game, Avatars, unnamedAccounts, advanceToEpoch, advanceToRevealPhase, getEpoch, getTimestamp} =
			await networkHelpers.loadFixture(deployAll);

		const before_avatars = await env.read(Game, {
			functionName: 'getAvatarsInZone',
			args: [0n, 0n, 100n],
		});

		console.log(before_avatars);

		const timestamp = await getTimestamp();
		const {epoch: initialEpoch, commiting: initialCommiting} = getEpoch(timestamp);

		await advanceToEpoch(initialEpoch + 2);

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
			functionName: 'deposit',
			args: [avatarID, env.unnamedAccounts[0], zeroAddress],
		});

		const entrancePosition = 0n;
		await env.execute(Game, {
			account: env.unnamedAccounts[0],
			functionName: 'enter',
			args: [avatarID, entrancePosition],
		});

		await advanceToEpoch(initialEpoch + 3);

		const hash = '0x000000000000000000000000000000000000000000000000';
		const secret = '0x0000000000000000000000000000000000000000000000000000000000000000';
		await env.execute(Game, {
			account: env.unnamedAccounts[0],
			functionName: 'commit',
			args: [avatarID, hash, zeroAddress],
		});

		await advanceToRevealPhase(initialEpoch + 3);

		await env.execute(Game, {
			account: env.unnamedAccounts[0],
			functionName: 'reveal',
			args: [
				avatarID,
				[
					{actionType: 0, data: 4n},
					{actionType: 0, data: 4n},
				],
				secret,
				zeroAddress,
			],
		});

		// const after_avatars = await env.read(Game, {
		// 	functionName: 'getAvatarsInZone',
		// 	args: [0n, 0n, 100n],
		// });

		const after_avatars = await env.read(Game, {
			functionName: 'getAvatarsInMultipleZones',
			args: [[1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n, 12n, 13n, 14n, 0n], 0n, 100n],
		});

		console.log(after_avatars);
	});
});
