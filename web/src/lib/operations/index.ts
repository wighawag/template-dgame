import type {TypedDeployments} from '$lib/core/connection/types';
import type {CameraControl} from '$lib/core/render/camera';
import {warning} from '$lib/core/ui/modal/warning';
import type {AvatarsCollectionStore} from '$lib/onchain/avatars';
import type {
	LocalReadyState,
	LocalState,
	LocalStateStore,
} from '$lib/private/localState';
import type {MyEventEmitter} from '$lib/render/eventEmitter';
import type {EpochConfigStore, EpochInfo, EpochInfoStore} from '$lib/types';
import type {EnterFlowStore} from '$lib/ui/flows/enter/enterFlow';
import type {Position, ViewState} from '$lib/view';
import {areaAt, zoneLocalCoord} from 'reveal-or-die-contracts';
import {get, type Readable} from 'svelte/store';

type ReadyState = {
	step: 'Ready';
	currentPosition: Position;
	currentCellType: number;
	exited: boolean;
	epoch: number;
	$viewState: ViewState;
	$localState: LocalReadyState;
	$epochInfo: EpochInfo;
	timeup: boolean;
};
type CurrentState =
	| {
			step: 'Idle';
			$viewState: ViewState;
			$localState: LocalState;
			$epochInfo: EpochInfo;
			timeup: boolean;
	  }
	| ReadyState;

export function createOperations(params: {
	localState: LocalStateStore;
	epochInfo: EpochInfoStore;
	epochConfig: EpochConfigStore;
	viewState: Readable<ViewState>;
	cameraControl: CameraControl;
	avatars: AvatarsCollectionStore;
	enterFlow: EnterFlowStore;
	deployments: TypedDeployments;
	eventEmitter: MyEventEmitter;
}) {
	const {
		deployments,
		localState,
		epochInfo,
		epochConfig,
		viewState,
		cameraControl,
		avatars,
		enterFlow,
		eventEmitter,
	} = params;
	function gatherState(): CurrentState {
		const $epochInfo = epochInfo.now();
		const {currentEpoch: epoch} = $epochInfo;

		const timeup =
			$epochInfo.type === 'manual'
				? false
				: !$epochInfo.isCommitPhase ||
					// TODO add a current field on EpochConfigStore
					$epochInfo.timeLeftInPhase <
						get(epochConfig).commitTimeAllowance - 0.2;

		localState.update(epoch);
		const $localState = get(localState);
		const $viewState = get(viewState);
		const avatarEntity =
			$localState.signer && $localState.avatar?.avatarID
				? $viewState.entities[$localState.avatar.avatarID]
				: undefined;

		if ($localState.signer && $localState.avatar && avatarEntity) {
			let currentPosition: Position;

			let exited = false;
			if (
				$localState.avatar.epoch === epoch &&
				$localState.avatar.actions.length > 0
			) {
				const lastAction =
					$localState.avatar.actions[$localState.avatar.actions.length - 1];

				currentPosition = lastAction;
				exited = lastAction.type === 'exit';
			} else {
				currentPosition = avatarEntity.position;
			}
			const areaLocalX = zoneLocalCoord(currentPosition.x);
			const areaLocalY = zoneLocalCoord(currentPosition.y);
			const area = areaAt(currentPosition.x, currentPosition.y);
			const cellIndex = areaLocalX + areaLocalY * area.size;
			const currentCellType = area.cells[cellIndex];

			return {
				step: 'Ready',
				currentPosition,
				currentCellType,
				exited,
				epoch,
				$viewState,
				$localState: $localState as LocalReadyState,
				$epochInfo,
				timeup,
			};
		} else {
			return {
				step: 'Idle',
				$viewState,
				$localState,
				$epochInfo,
				timeup,
			};
		}
	}

	function addMove(dx: number, dy: number) {
		const currentState = gatherState();
		if (currentState.timeup) {
			return;
		}

		if (currentState.step === 'Ready' && !currentState.exited) {
			const toX = currentState.currentPosition.x + dx;
			const toY = currentState.currentPosition.y + dy;

			const areaLocalX = zoneLocalCoord(toX);
			const areaLocalY = zoneLocalCoord(toY);
			const area = areaAt(toX, toY);
			const cellIndex = areaLocalX + areaLocalY * area.size;

			const numMovesSoFar = currentState.$localState.avatar.actions.filter(
				(v) => v.type === 'move',
			).length;
			if (
				numMovesSoFar >= Number(deployments.contracts.Game.linkedData.numMoves)
			) {
				return;
			}

			if (area.cells[cellIndex] == 0 || area.cells[cellIndex] == 3) {
				localState.addAction(currentState.epoch, {
					type: 'move',
					x: toX,
					y: toY,
				});
				cameraControl.follow(toX, toY);
			}
		}
	}

	function addExit(currentState: ReadyState) {
		if (currentState.timeup) {
			return;
		}

		if (!currentState.exited) {
			if (currentState.currentCellType == 3) {
				localState.addAction(currentState.epoch, {
					type: 'exit',
					x: currentState.currentPosition.x,
					y: currentState.currentPosition.y,
				});
			}
		}
	}

	function startListening() {
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
			if (currentState.timeup) {
				return;
			}
			if (currentState.step === 'Ready') {
				if (currentState.currentCellType === 3) {
					addExit(currentState);
				}
			}
		});

		eventEmitter.on('action-2', () => {
			const currentState = gatherState();
			if (currentState.timeup) {
				return;
			}
			if (currentState.step === 'Ready') {
				console.log(`action-2`);
			}
		});

		eventEmitter.on('clicked', (pos) => {
			const areaLocalX = zoneLocalCoord(pos.x);
			const areaLocalY = zoneLocalCoord(pos.y);
			const area = areaAt(pos.x, pos.y);
			const cellIndex = areaLocalX + areaLocalY * area.size;
			const currentCellType = area.cells[cellIndex];

			if (currentCellType == 0) {
				const $avatars = get(avatars);

				if ($avatars.step == 'Loaded') {
					// && $avatars.avatarsInGame.length == 0) {
					enterFlow.start(pos);
				}
			}
		});

		eventEmitter.on('backspace', () => {
			const currentState = gatherState();
			if (currentState.timeup) {
				return;
			}
			localState.rewind(currentState.$epochInfo.currentEpoch);
		});
	}

	function stopListening() {
		eventEmitter.removeAllListeners();
	}

	return {
		startListening,
		stopListening,
	};
}
