import {expect} from 'earl';
import {describe, it} from 'node:test'; // using node:test as hardhat v3 do not support vitest
import {network} from 'hardhat';
import {setupFixtures} from './utils/index.js';

const {provider, networkHelpers} = await network.connect();
const {deployAll} = setupFixtures(provider);

describe('Game', function () {
	it('basic test', async function () {
		const {env, Game, unnamedAccounts} = await networkHelpers.loadFixture(deployAll);
	});
});
