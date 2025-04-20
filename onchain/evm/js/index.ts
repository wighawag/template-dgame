import {getContract, PublicClient} from 'viem';
import type {Abi_IGame} from '@generated/types/IGame.js';
import {Abi, ExtractAbiEvent, ExtractAbiEventNames} from 'abitype';

export type Avatar = {
	position: bigint;
};

function getEventFromAbi<abi extends Abi, eventName extends ExtractAbiEventNames<abi>>(
	abi: abi,
	eventName: eventName,
): ExtractAbiEvent<abi, eventName> {
	for (const item of abi) {
		if (item.type === 'event' && item.name === eventName) {
			return item as ExtractAbiEvent<abi, eventName>;
		}
	}
	throw new Error('Event not found');
}

export function createReader(viemClient: PublicClient, Game: {abi: Abi_IGame; address: `0x${string}`}) {
	const viemContract = getContract({abi: Game.abi, address: Game.address, client: viemClient});

	async function getAvatars(
		epoch: number,
		camera: {x: number; y: number; width: number; height: number},
	): Promise<readonly Avatar[]> {
		const zones = [0n, 1n]; // TODO calculate zones from camera
		const [avatars, more] = await viemContract.read.getAvatarsInMultipleZones([zones, 0n, 100n]);

		const event = getEventFromAbi(Game.abi, 'CommitmentRevealed');
		const logs = viemClient.getLogs({
			address: Game.address,
			event,
			args: {
				epoch: BigInt(epoch - 1),
				zone: zones,
			},
		});
		// TODO populate avatars info from logs and add avatar not already present if any

		// const logs2 = viemContract.getEvents.CommitmentRevealed({epoch: BigInt(epoch - 1), zone: zones});

		return avatars;
	}
}
