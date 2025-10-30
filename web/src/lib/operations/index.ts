import { eventEmitter } from '$lib/render/eventEmitter';
import { localState } from '$lib/private/localState';
import { get } from 'svelte/store';
import { avatars } from '$lib/onchain/avatars';
import { enterFlow } from '$lib/ui/flows/enter/enterFlow';
import { epochInfo } from '$lib/time';
import { viewState, type Position } from '$lib/view';
import { Areas, zoneLocalCoord } from 'dgame-contracts';

type ReadyState = {
	step: 'Ready';
	currentPosition: Position;
	currentCellType: number;
	exited: boolean;
	epoch: number;
};
type CurrentState = { step: 'Idle' } | ReadyState;

function gatherState(): CurrentState {
	const $epochInfo = epochInfo.now();
	const { currentEpoch: epoch } = $epochInfo;

	const $localState = get(localState);
	const $viewState = get(viewState);
	const avatarEntity =
		$localState.signer && $localState.avatar?.avatarID
			? $viewState.entities[$localState.avatar.avatarID]
			: undefined;

	if ($localState.signer && $localState.avatar && avatarEntity) {
		let currentPosition: Position;

		let exited = false;
		if ($localState.avatar.epoch === epoch && $localState.avatar.actions.length > 0) {
			const lastAction = $localState.avatar.actions[$localState.avatar.actions.length - 1];

			currentPosition = lastAction;
			exited = lastAction.type === 'exit';
		} else {
			currentPosition = avatarEntity.position;
		}
		const areaLocalX = zoneLocalCoord(currentPosition.x);
		const areaLocalY = zoneLocalCoord(currentPosition.y);
		// TODO pick area
		const area = Areas[2];
		const cellIndex = areaLocalX + areaLocalY * area.size;
		const currentCellType = area.cells[cellIndex];

		return { step: 'Ready', currentPosition, currentCellType, exited, epoch };
	} else {
		return {
			step: 'Idle'
		};
	}
}

function addMove(dx: number, dy: number) {
	const currentState = gatherState();

	if (currentState.step === 'Ready' && !currentState.exited) {
		const toX = currentState.currentPosition.x + dx;
		const toY = currentState.currentPosition.y + dy;

		const areaLocalX = zoneLocalCoord(toX);
		const areaLocalY = zoneLocalCoord(toY);
		// TODO pick area
		const area = Areas[2];
		const cellIndex = areaLocalX + areaLocalY * area.size;

		if (area.cells[cellIndex] == 0 || area.cells[cellIndex] == 3) {
			localState.addAction(currentState.epoch, {
				type: 'move',
				x: toX,
				y: toY
			});
		}
	}
}

function addExit(currentState: ReadyState) {
	if (!currentState.exited) {
		if (currentState.currentCellType == 3) {
			localState.addAction(currentState.epoch, {
				type: 'exit',
				x: currentState.currentPosition.x,
				y: currentState.currentPosition.y
			});
		}
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
		const currentState = gatherState();
		if (currentState.step === 'Ready') {
			if (currentState.currentCellType === 3) {
				addExit(currentState);
			}
		}
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
