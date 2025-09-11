import { writes } from '$lib/onchain/writes';
import { eventEmitter } from '$lib/render/eventEmitter';
import { localState } from '$lib/private/localState';
import { get } from 'svelte/store';
import { avatars } from '$lib/onchain/avatars';
import { enterFlow } from '$lib/ui/flows/enter/enterFlow';

export function startListening() {
	eventEmitter.on('down', () => {
		localState.move(0, 1);
	});

	eventEmitter.on('up', () => {
		localState.move(0, -1);
	});

	eventEmitter.on('left', () => {
		localState.move(-1, 0);
	});

	eventEmitter.on('right', () => {
		localState.move(1, 0);
	});

	eventEmitter.on('action', () => {
		// TODO action localState
	});

	eventEmitter.on('clicked', (pos) => {
		if (pos.x == 0 && pos.y == 0) {
			const $avatars = get(avatars);
			// if ($avatars.step == 'Loaded' && $avatars.avatarsInGame.length == 0) {
			enterFlow.start();
			// }
		}
	});
}

export function stopListening() {
	eventEmitter.removeAllListeners();
}
