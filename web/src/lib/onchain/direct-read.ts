import { get, writable, type Readable } from 'svelte/store';
import type { OnchainState } from './types';
import { epochInfo } from '$lib/time';

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

export function createDirectReadStore(camera: Readable<Camera>): Readable<OnchainState> {
	let $state: OnchainState = defaultState();
	let $camera: Camera = get(camera);

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

	async function fetchState(camera: Camera) {
		// const zones = calculateSurroundingZones({
		// 	x: Math.floor(camera.x),
		// 	y: Math.floor(camera.y)
		// });

		const $epochInfo = epochInfo.now();

		// const result = await gameContract.functions.get_zones(zones).get();
		// if (hasCameraChanged($camera, camera)) {
		// 	return;
		// }
		const state: OnchainState = defaultState();

		// for (const entitiesFetched of result.value.zones) {
		// 	for (const entity of entitiesFetched) {
		// 		const player = entity.Player;
		// 		const bomb = entity.Bomb;
		// 		if (player) {
		// 			const id = player.account.Address?.bits || player.account.ContractId!.bits;

		// 			const entity = {
		// 				id,
		// 				type: 'player',
		// 				position: {
		// 					x: player.position.x.toNumber() - (1 << 30),
		// 					y: player.position.y.toNumber() - (1 << 30)
		// 				},
		// 				life: player.life.toNumber(),
		// 				epoch: player.epoch.toNumber()
		// 			} as const;
		// 			state.entities[id] = entity;
		// 		} else if (bomb) {
		// 			const id = `${bomb.position.x},${bomb.position.y}`;
		// 			state.entities[id] = {
		// 				id,
		// 				type: 'bomb',
		// 				position: {
		// 					x: bomb.position.x.toNumber() - (1 << 30),
		// 					y: bomb.position.y.toNumber() - (1 << 30)
		// 				},
		// 				explosion_start: bomb.start.toNumber(),
		// 				explosion_end: bomb.end.toNumber()
		// 			};
		// 		} else {
		// 			console.error(`unknown type`, entity);
		// 		}
		// 	}
		// }

		set(state);
	}

	let unsubscribeFromCamera: (() => void) | undefined;
	let timeout: NodeJS.Timeout | undefined;
	function start() {
		unsubscribeFromCamera = camera.subscribe(async (camera) => {
			const cameraChanged = hasCameraChanged($camera, camera);
			$camera = { ...camera };
			if (cameraChanged) {
				if (timeout) {
					clearTimeout(timeout);
				}
				try {
					await fetchState($camera);
				} finally {
					timeout = setTimeout(fetchLater, 15000);
				}
			}
		});

		function fetchLater() {
			fetchState($camera);
			timeout = setTimeout(fetchLater, 500);
		}
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(fetchLater, 500);

		return stop;
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
		subscribe: _store.subscribe
	};
}
