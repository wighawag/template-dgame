import hre from 'hardhat';
import {loadEnvironmentFromHardhat} from 'hardhat-deploy/helpers';
import {Abi_Game} from '@generated/types/Game.js';
import {zeroAddress} from 'viem';

async function main() {
	const env = await loadEnvironmentFromHardhat({hre});
	const Game = env.get<Abi_Game>('Game');

	const before_characters = await env.read(Game, {
		functionName: 'getCharactersInZone',
		args: [],
	});

	console.log(before_characters);

	await env.execute(Game, {
		account: env.namedAccounts.deployer,
		functionName: 'makeCommitments',
		args: [[{avatarID: 1n, hash: '0x0000000000000000000000000000000000000000000000000000000000000000'}], zeroAddress],
	});

	const after_characters = await env.read(Game, {
		functionName: 'getCharactersInZone',
		args: [],
	});
	console.log(after_characters);
}
main();
