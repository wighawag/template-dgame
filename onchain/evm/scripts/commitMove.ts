import hre from 'hardhat';
import {loadEnvironmentFromHardhat} from 'hardhat-deploy/helpers';
import {Abi_Game} from '@generated/types/Game.js';

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
		functionName: 'commit',
		args: [],
	});

	const after_characters = await env.read(Game, {
		functionName: 'getCharactersInZone',
		args: [],
	});
	console.log(after_characters);
}
main();
