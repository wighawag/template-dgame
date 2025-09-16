import { get, writable, type Readable } from 'svelte/store';
import type { AvatarEntity, OnchainState } from './types';
import { epochInfo, time } from '$lib/time';
import { bigIntIDToXY, calculateVisibleZones, type Position } from 'dgame-contracts';
import { publicClient } from '$lib/connection';
import contracts from '$lib/contracts';
import { type GetContractEventsReturnType } from 'viem';
import { getChainParameters } from '$lib/connection/chains';

const Game = contracts.contracts.Game;

type Camera = {
	x: number;
	y: number;
	width: number;
	height: number;
};

function defaultState() {
	return {
		entities: {},
		epoch: 0
	};
}

export function createDirectReadStore(camera: Readable<Camera>) {
	let $state: OnchainState = defaultState();
	let lastCamera: Camera = get(camera);
	let lastEpoch = get(epochInfo).currentEpoch;
	let lastZones: bigint[] | undefined;

	const _store = writable<OnchainState>($state, start);
	function set(state: OnchainState) {
		$state = state;
		_store.set($state);
		return $state;
	}

	function hasCameraChanged(oldCamera: Camera, newCamera: Camera) {
		return (
			oldCamera.x !== newCamera.x ||
			oldCamera.y !== newCamera.y ||
			oldCamera.width !== newCamera.width ||
			oldCamera.height !== newCamera.height
		);
	}

	function hasZonesChanged(zonesA?: bigint[], zonesB?: bigint[]) {
		if (!zonesA) {
			return true;
		}
		if (!zonesB) {
			return true;
		}
		if (zonesA == zonesB) {
			return false;
		}
		if (zonesA.length != zonesB.length) {
			return true;
		}
		for (let i = 0, l = zonesA.length; i < l; i++) {
			if (zonesA[i] != zonesB[i]) {
				return true;
			}
		}
		return false;
	}

	async function fetchState(camera: Camera, fromCameraUpdate: boolean) {
		const zones = calculateVisibleZones(camera);

		if (fromCameraUpdate && !hasZonesChanged(lastZones, zones)) {
			return;
		}

		// TODO has epcoh changed ?
		// if (!fromCameraUpdate && ) {
		// 	return;
		// }

		const result = await publicClient.readContract({
			...Game,
			functionName: 'getAvatarsInMultipleZones',
			args: [zones, 0n, 100n] // TODO use pagination
		});
		if (fromCameraUpdate) {
			const newZones = calculateVisibleZones(lastCamera);
			if (hasZonesChanged(zones, newZones)) {
				// if changed while fetching, we stop right here
				return;
			}
		}

		const epoch = result[2];

		if (Number(epoch) < lastEpoch) {
			// we consider for refetch
			lastEpoch = Number(epoch);
		}

		const blockTime = BigInt(getChainParameters(contracts.chainId).blockTime);
		const currentBlockNumber = await publicClient.getBlockNumber();
		const fromBlock =
			(currentBlockNumber -
				(BigInt(contracts.contracts.Game.linkedData.commitPhaseDuration) +
					BigInt(contracts.contracts.Game.linkedData.revealPhaseDuration))) /
			blockTime;

		const events = await publicClient.getContractEvents({
			...Game,
			eventName: 'CommitmentRevealed',
			args: {
				epoch: epoch - 1n,
				zone: zones
			},
			strict: true,
			fromBlock,
			toBlock: currentBlockNumber
		});

		// console.log(`events for ${epoch}`, events);

		const avatarEvents: Map<
			bigint,
			GetContractEventsReturnType<typeof Game.abi, 'CommitmentRevealed', true>[0]
		> = new Map();
		for (const event of events) {
			avatarEvents.set(event.args.avatarID, event);
		}

		const state: OnchainState = defaultState();

		state.epoch = Number(epoch);

		for (const entityFetched of result[0]) {
			const id = entityFetched.avatarID.toString();

			let path: Position[] = [];

			const event = avatarEvents.get(entityFetched.avatarID);
			if (event) {
				path = event.args.actions.filter((v) => v.actionType == 1).map((v) => bigIntIDToXY(v.data));
			}

			const { x, y } = bigIntIDToXY(entityFetched.position);
			const entity: AvatarEntity = {
				id,
				type: 'avatar',
				position: {
					x: Number(x),
					y: Number(y)
				},
				life: 1, // TODO ?
				path
			};
			state.entities[id] = entity;
		}

		lastZones = zones;
		set(state);
	}

	let timeout: NodeJS.Timeout | undefined;
	async function fetchContinuously(fromCameraUpdate?: boolean) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}

		let retryIn = 15000;
		try {
			await fetchState(lastCamera, fromCameraUpdate || false);
		} catch (err) {
			console.error(`failed to fetch state`, err);
			retryIn = 1000;
		} finally {
			if (!timeout) {
				timeout = setTimeout(fetchContinuously, retryIn);
			}
		}
	}

	let unsubscribeFromCamera: (() => void) | undefined;
	let unsubscribeFromEpochInfo: (() => void) | undefined;

	function start() {
		unsubscribeFromCamera = camera.subscribe((camera) => {
			const cameraChanged = hasCameraChanged(lastCamera, camera);
			if (cameraChanged) {
				lastCamera = { ...camera };
				fetchContinuously(true);
			}
		});

		unsubscribeFromEpochInfo = epochInfo.subscribe((epochInfo) => {
			if (epochInfo.currentEpoch != lastEpoch || $state.epoch != epochInfo.currentEpoch) {
				lastEpoch = epochInfo.currentEpoch;
				fetchContinuously(false);
			}
		});

		fetchContinuously(false);

		return stop;
	}

	async function update() {
		await fetchContinuously();
		return $state;
	}

	function stop() {
		if (unsubscribeFromCamera) {
			unsubscribeFromCamera();
			unsubscribeFromCamera = undefined;
		}

		if (unsubscribeFromEpochInfo) {
			unsubscribeFromEpochInfo();
			unsubscribeFromEpochInfo = undefined;
		}
		if (timeout) {
			clearTimeout(timeout);
		}
		// TODO set as IDle ?
		set(defaultState());
	}

	return {
		subscribe: _store.subscribe,
		update
	};
}
