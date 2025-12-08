import { camera, type Camera } from '$lib/core/render/camera';
import { startListening, stopListening } from '$lib/operations';
import { eventEmitter, type MyEventEmitter } from '$lib/render/eventEmitter';
import { viewState, type ViewState } from '$lib/view';
import { Container } from 'pixi.js';
import type { Readable } from 'svelte/store';

export function createRenderer(viewState: Readable<ViewState>, eventEmitter: MyEventEmitter) {
	let unsubscribe: (() => void) | undefined = undefined;
	let cameraUnsubscribe: (() => void) | undefined = undefined;

	function getVisibleBounds(camera: Camera): {
		startX: number;
		endX: number;
		startY: number;
		endY: number;
	} {
		// Large margin to ensure no gaps at area boundaries
		const margin = 20;
		return {
			startX: Math.floor(camera.x - camera.width / 2 - margin),
			endX: Math.ceil(camera.x + camera.width / 2 + margin),
			startY: Math.floor(camera.y - camera.height / 2 - margin),
			endY: Math.ceil(camera.y + camera.height / 2 + margin)
		};
	}

	async function onAppStarted(container: Container) {
		console.log(`renderer has started!`);
		startListening();

		function updateFromCamera(camera: Camera) {
			const bounds = getVisibleBounds(camera);

			// TODO
		}

		// Subscribe to camera changes for wall rendering
		cameraUnsubscribe = camera.subscribe(($camera) => {
			updateFromCamera($camera);
		});

		unsubscribe = viewState.subscribe(($viewState) => {});
	}

	function onAppStopped() {
		stopListening();

		unsubscribe?.();
		cameraUnsubscribe?.();
	}

	// Per-frame update for all game objects
	function tick() {
		// TODO
	}

	return {
		onAppStarted,
		onAppStopped,
		tick
	};
}

export const renderer = createRenderer(viewState, eventEmitter);

export type Renderer = ReturnType<typeof createRenderer>;
