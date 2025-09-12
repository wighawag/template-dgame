import { get, writable, type Readable } from 'svelte/store';
import type { OnchainState } from './types';
import { epochInfo } from '$lib/time';
import { bigIntIDToXY, calculateVisibleZones } from 'dgame-contracts';
import { publicClient } from '$lib/connection';
import contracts from '$lib/contracts';

type Camera = {
	x: number;
	y: number;
	width: number;
	height: number;
};

function defaultState() {
	return {
		entities: {}
	};
}

export function createDirectReadStore(camera: Readable<Camera>) {
	let $state: OnchainState = defaultState();
	let $camera: Camera = get(camera);
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
		const $epochInfo = epochInfo.now();

		const result = await publicClient.readContract({
			abi: contracts.contracts.Game.abi,
			address: contracts.contracts.Game.address,
			functionName: 'getAvatarsInMultipleZones',
			args: [zones, 0n, 100n] // TODO use pagination
		});
		if (fromCameraUpdate) {
			const newZones = calculateVisibleZones($camera);
			if (hasZonesChanged(zones, newZones)) {
				// if changed while fetching, we stop right here
				return;
			}
		}

		const state: OnchainState = defaultState();

		for (const entityFetched of result[0]) {
			const id = entityFetched.avatarID.toString();

			const { x, y } = bigIntIDToXY(entityFetched.position);
			const entity = {
				id,
				type: 'player',
				position: {
					x: Number(x),
					y: Number(y)
				},
				life: 1,
				epoch: 1 // TODO
			} as const;
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
			await fetchState($camera, fromCameraUpdate || false);
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

	function start() {
		unsubscribeFromCamera = camera.subscribe(async (camera) => {
			const cameraChanged = hasCameraChanged($camera, camera);
			if (cameraChanged) {
				$camera = { ...camera };
				fetchContinuously(true);
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
			// TODO set as IDle ?
			set(defaultState());
			unsubscribeFromCamera();
			unsubscribeFromCamera = undefined;
		}
		if (timeout) {
			clearTimeout(timeout);
		}
	}

	return {
		subscribe: _store.subscribe,
		update
	};
}
