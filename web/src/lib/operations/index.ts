import { eventEmitter } from '$lib/render/eventEmitter';
import { localState } from '$lib/private/localState';
import { get } from 'svelte/store';
import { avatars } from '$lib/onchain/avatars';
import { enterFlow } from '$lib/ui/flows/enter/enterFlow';
import { epochInfo } from '$lib/time';
import { viewState, type Position } from '$lib/view';

function addMove(dx: number, dy: number) {
	const $epochInfo = epochInfo.now();
	const { currentEpoch: epoch } = $epochInfo;

	const $localState = get(localState);
	const $viewState = get(viewState);
	const playerEntity =
		$localState.signer && $localState.avatar?.avatarID
			? $viewState.entities[$localState.avatar.avatarID]
			: undefined;
	if ($localState.signer && $localState.avatar && playerEntity) {
		let currentPosition: Position;
		if ($localState.avatar.epoch === epoch && $localState.avatar.actions.length > 0) {
			currentPosition = $localState.avatar.actions[$localState.avatar.actions.length - 1];
		} else {
			currentPosition = playerEntity.position;
		}

		localState.addAction(epoch, {
			type: 'move',
			x: currentPosition.x + dx,
			y: currentPosition.y + dy
		});
	}
}

export function startListening() {
	eventEmitter.on('down', () => {
		addMove(0, 1);
	});

	eventEmitter.on('up', () => {
		addMove(0, -1);
	});

	eventEmitter.on('left', () => {
		addMove(-1, 0);
	});

	eventEmitter.on('right', () => {
		addMove(1, 0);
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

	eventEmitter.on('backspace', () => {
		const $epochInfo = epochInfo.now();
		const { currentEpoch: epoch } = $epochInfo;
		localState.rewind(epoch);
	});
}

export function stopListening() {
	eventEmitter.removeAllListeners();
}
