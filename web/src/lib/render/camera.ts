import { writable, type Readable } from 'svelte/store';

export type Camera = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type CameraWatcher = Readable<Camera> & {
	update(values: Camera): void;
};

let $camera = {
	x: 0,
	y: 0,
	width: 0,
	height: 0
};
const cameraStore = writable<Camera>($camera);

export const camera: CameraWatcher = {
	subscribe: cameraStore.subscribe,
	update(values: Camera) {
		if (
			$camera.x != values.x ||
			$camera.y != values.y ||
			$camera.width != values.width ||
			$camera.height != values.height
		) {
			$camera = values;
			cameraStore.set($camera);
		}
	}
};
