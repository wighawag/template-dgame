import { writes } from '$lib/onchain/writes';
import { eventEmitter } from '$lib/render/eventEmitter';
import { localState } from '$lib/view/localState';

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
		// TODO
		writes.enter();
	});

	eventEmitter.on('clicked', (pos) => {
		console.log(pos);
	});
}

export function stopListening() {
	eventEmitter.removeAllListeners();
}
