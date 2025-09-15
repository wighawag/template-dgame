import {expect} from 'earl';
import {describe, it} from 'node:test'; // using node:test as hardhat v3 do not support vitest
import {network} from 'hardhat';
import {setupFixtures} from './utils/index.js';
import {decodeEventLog, encodeAbiParameters, zeroAddress} from 'viem';

const {provider, networkHelpers, viem} = await network.connect();
const {deployAll} = setupFixtures(provider);

describe('Game', function () {
	it('basic test', async function () {
		const {
			env,
			Game,
			Avatars,
			AvatarsSale,
			unnamedAccounts,
			advanceToEpoch,
			advanceToRevealPhase,
			getEpoch,
			getTimestamp,
		} = await networkHelpers.loadFixture(deployAll);

		const before_avatars = await env.read(Game, {
			functionName: 'getAvatarsInZone',
			args: [0n, 0n, 100n],
		});

		// console.log(before_avatars);

		const timestamp = await getTimestamp();
		const {epoch: initialEpoch, commiting: initialCommiting} = getEpoch(timestamp);

		const subID = 0n;
		const avatarID = (BigInt(unnamedAccounts[0]) << 96n) + subID;
		await env.execute(AvatarsSale, {
			account: env.unnamedAccounts[0],
			functionName: 'purchase',
			args: [
				Game.address,
				subID,
				encodeAbiParameters([{type: 'address'}, {type: 'address'}], [unnamedAccounts[0], unnamedAccounts[0]]),
				zeroAddress,
				0n,
				zeroAddress,
			],
			value: BigInt(AvatarsSale.linkedData!.paymentAmount as string),
		});

		await advanceToEpoch(initialEpoch + 2);
		const entrancePosition = 0n;
		const hash = '0x000000000000000000000000000000000000000000000000';
		const secret = '0x0000000000000000000000000000000000000000000000000000000000000000';
		await env.execute(Game, {
			account: env.unnamedAccounts[0],
			functionName: 'commit',
			args: [avatarID, hash, zeroAddress],
		});

		await advanceToRevealPhase(initialEpoch + 2);

		await env.execute(Game, {
			account: env.unnamedAccounts[0],
			functionName: 'reveal',
			args: [avatarID, [{actionType: 0, data: entrancePosition}], secret, zeroAddress],
		});

		await advanceToEpoch(initialEpoch + 3);

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
					{actionType: 1, data: 4n},
					{actionType: 1, data: 4n},
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

		expect(after_avatars[0][0].position).toEqual(4n);
		// console.log(after_avatars);
	});
});
