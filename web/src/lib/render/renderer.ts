import {
	type Camera,
	type CameraControl,
	type CameraWatcher,
} from '$lib/core/render/camera';
import {type MyEventEmitter} from '$lib/render/eventEmitter';
import {createGamepadController} from '$lib/render/gamepads';
import {createKeyboardController} from '$lib/render/keyboard-controller';
import {type Position, type ViewEntity, type ViewState} from '$lib/view';
import {areaAt, ZONE_SIZE, zoneLocalCoord} from 'reveal-or-die-contracts';
import {AnimatedSprite, Container, Sprite} from 'pixi.js';
import type {Readable} from 'svelte/store';
import {AvatarObject} from './objects/AvatarObject';
import type {GameObject} from './objects/GameObject';
import {TileSpritePool} from './SpritePool';
import {TileType} from './TileSpritesheet';
import {createOperations} from '$lib/operations';
import type {LocalStateStore} from '$lib/private/localState';
import type {AvatarsCollectionStore} from '$lib/onchain/avatars';
import type {EnterFlowStore} from '$lib/ui/flows/enter/enterFlow';
import type {TypedDeployments} from '$lib/core/connection/types';
import type {EpochConfigStore, EpochInfoStore} from '$lib/types';

const CELL_SIZE = 10;

// Cell types based on the ASCII parsing
export enum CellType {
	Empty = 0,
	Wall = 1,
	Box = 2,
	Exit = 3,
}

// Interface for tile positioning and type information
interface TileInfo {
	x: number;
	y: number;
	type: CellType;
}

export type World = {
	pathDisplayObject: Container;
	epochSeen: {upcoming?: number; epoch: number; localTime: number} | null;
};

export function createRenderer(params: {
	viewState: Readable<ViewState>;
	eventEmitter: MyEventEmitter;

	epochInfo: EpochInfoStore;
	localState: LocalStateStore;
	epochConfig: EpochConfigStore;
	camera: CameraWatcher;
	cameraControl: CameraControl;
	avatars: AvatarsCollectionStore;
	enterFlow: EnterFlowStore;
	deployments: TypedDeployments;
}) {
	const {
		viewState,
		eventEmitter,
		epochInfo,
		localState,
		epochConfig,
		camera,
		cameraControl,
		avatars,
		enterFlow,
		deployments,
	} = params;
	const operations = createOperations({
		localState,
		epochInfo,
		epochConfig,
		cameraControl,
		avatars,
		enterFlow,
		viewState,
		eventEmitter,
		deployments,
	});
	let gameObjects: {[id: string]: GameObject} = {};
	let unsubscribe: (() => void) | undefined = undefined;
	let cameraUnsubscribe: (() => void) | undefined = undefined;
	const spritePool = new TileSpritePool();
	const visibleTiles: Map<string, Sprite> = new Map();

	let keyboardController = createKeyboardController(eventEmitter);
	let gamepadController = createGamepadController(eventEmitter);

	function removeTileSprite(key: string): void {
		const sprite = visibleTiles.get(key);
		if (sprite) {
			spritePool.returnSprite(sprite);
			visibleTiles.delete(key);
		}
	}

	function getCellAt(worldX: number, worldY: number): CellType {
		// Use the same zoneLocalCoord function as game operations
		const areaLocalX = zoneLocalCoord(worldX);
		const areaLocalY = zoneLocalCoord(worldY);
		const cellIndex = areaLocalX + areaLocalY * ZONE_SIZE;

		const area = areaAt(worldX, worldY);
		return area.cells[cellIndex] as CellType;
	}

	function getKey(x: number, y: number, cellType: CellType): string {
		return `${x},${y},${cellType}`;
	}

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
			endY: Math.ceil(camera.y + camera.height / 2 + margin),
		};
	}

	function getTileType(cellType: CellType): TileType {
		switch (cellType) {
			case CellType.Wall:
				return TileType.Wall;
			case CellType.Box:
				return TileType.Box;
			case CellType.Exit:
				return TileType.Exit;
			default:
				return TileType.Empty;
		}
	}

	function getTilePosition(x: number, y: number): {x: number; y: number} {
		// Match the grid offset from PixiCanvas: -cellSize - cellSize/2 + (offset % cellSize)
		return {
			x: x * CELL_SIZE - CELL_SIZE / 2,
			y: y * CELL_SIZE - CELL_SIZE / 2,
		};
	}

	async function onAppStarted(container: Container) {
		console.log(`renderer has started!`);
		keyboardController.start();
		gamepadController.start();
		operations.startListening();

		let pathDisplayObject = new Container();
		container.addChild(pathDisplayObject);
		pathDisplayObject.zIndex = 1;

		function createTileSprite(tileInfo: TileInfo): Sprite {
			const tileType = getTileType(tileInfo.type);
			const sprite = spritePool.getSprite(tileType);

			const position = getTilePosition(tileInfo.x, tileInfo.y);
			sprite.x = position.x;
			sprite.y = position.y;
			// sprite.width = this.cellSize;
			// sprite.height = this.cellSize;

			// Add to appropriate container based on depth effect
			container.addChild(sprite);

			return sprite;
		}
		function updateFromCamera(camera: Camera) {
			const bounds = getVisibleBounds(camera);
			const newVisibleTiles: Map<string, TileInfo> = new Map();

			// Check each visible cell and collect tiles that should be visible
			for (let x = bounds.startX; x <= bounds.endX; x++) {
				for (let y = bounds.startY; y <= bounds.endY; y++) {
					const cellType = getCellAt(x, y);

					// if (cellType !== CellType.Empty) {
					const key = getKey(x, y, cellType);
					newVisibleTiles.set(key, {
						x,
						y,
						type: cellType,
					});
					// }
				}
			}

			// Remove tiles that are no longer visible
			for (const [key, sprite] of visibleTiles.entries()) {
				if (!newVisibleTiles.has(key)) {
					removeTileSprite(key);
				}
			}

			// Add or update tiles that should be visible
			for (const [key, tileInfo] of newVisibleTiles.entries()) {
				let sprite = visibleTiles.get(key);

				if (!sprite) {
					// Create new sprite
					sprite = createTileSprite(tileInfo);
					(sprite as any).tileInfo = tileInfo;

					visibleTiles.set(key, sprite);
				}
				if (tileInfo.type === CellType.Empty) {
					sprite.zIndex = Number.MIN_SAFE_INTEGER;
				} else {
					sprite.zIndex = 10 * tileInfo.y;
				}
			}
		}

		const world: World = {
			pathDisplayObject,
			epochSeen: null,
		};

		// Subscribe to camera changes for wall rendering
		cameraUnsubscribe = camera.subscribe(($camera) => {
			updateFromCamera($camera);
		});

		let animateExit: Position | undefined;

		unsubscribe = viewState.subscribe(($viewState) => {
			const epochToRecordAsSeen = $viewState.epoch;
			if (
				epochToRecordAsSeen != 0 &&
				(!world.epochSeen ||
					(!world.epochSeen.upcoming &&
						world.epochSeen.epoch < epochToRecordAsSeen) ||
					(world.epochSeen.upcoming &&
						world.epochSeen.upcoming < epochToRecordAsSeen))
			) {
				if (!world.epochSeen) {
					// console.log(`DIRECT: epoch ${epochToRecordAsSeen} has been seen`);
					world.epochSeen = {
						epoch: epochToRecordAsSeen,
						localTime: Date.now(),
					};
				} else {
					// console.log(`INDIRECT: epoch ${epochToRecordAsSeen} will be considered seen soon`);
					world.epochSeen = {
						upcoming: epochToRecordAsSeen,
						epoch: world.epochSeen?.epoch || epochToRecordAsSeen,
						localTime: Date.now(),
					};
					setTimeout(() => {
						// console.log(`epoch ${epochToRecordAsSeen} has been seen`);
						world.epochSeen = {
							epoch: epochToRecordAsSeen,
							localTime: Date.now(),
						};
					}, 2000);
				}
			}
			const processed = new Set();

			function onEntityAdded(id: string, entity: ViewEntity): GameObject {
				if (entity.type == 'avatar') {
					// console.log(`avatar added ${entity.id}`);
					const avatarObject = new AvatarObject(world, entity);
					container.addChild(avatarObject);
					gameObjects[id] = avatarObject;
					return avatarObject;
				} else {
					throw new Error(`unknown entity type : ${entity.type}`);
				}
			}

			function onEntityRemoved(id: string, gameObject: GameObject) {
				// console.log(`entity removed ${id}`);
				// TODO removal type ?
				gameObject.onRemoved();
				container.removeChild(gameObject);
				delete gameObjects[id];
			}

			function updateEntity(
				id: string,
				gameObject: GameObject,
				entity: ViewEntity,
			) {
				gameObject.update(entity, $viewState.epoch);

				if (entity.type == 'avatar') {
					gameObject.zIndex = 10 * entity.position.y + 2;
				} else {
					gameObject.zIndex = 10 * entity.position.y + 1;
				}
			}

			let newAnimatedExit: Position | undefined;
			if ($viewState.avatar?.id) {
				const entity = $viewState.entities[$viewState.avatar.id];
				if (entity && entity.type === 'avatar') {
					const action = entity.plannedActions?.find((v) => v.type === 'exit');
					newAnimatedExit = action;
					// console.log(`animatedExit`, animateExit)
				}
			}

			if (!animateExit) {
				if (newAnimatedExit) {
					animateExit = newAnimatedExit;
					for (const [key, sprite] of visibleTiles.entries()) {
						const tileInfo: TileInfo = (sprite as any).tileInfo;
						const type: TileType = (sprite as any).type;
						if (
							tileInfo.x === newAnimatedExit.x &&
							tileInfo.y === newAnimatedExit.y
						) {
							// console.log(`found`, tileInfo)
							if (sprite instanceof AnimatedSprite) {
								// console.log(`play`)
								sprite.play();
							}
						}
					}
				}
			} else {
				if (!newAnimatedExit) {
					newAnimatedExit = animateExit;
					animateExit = undefined;
					for (const [key, sprite] of visibleTiles.entries()) {
						const tileInfo: TileInfo = (sprite as any).tileInfo;
						const type: TileType = (sprite as any).type;
						if (
							tileInfo.x === newAnimatedExit.x &&
							tileInfo.y === newAnimatedExit.y
						) {
							// console.log(`found`, tileInfo)
							if (sprite instanceof AnimatedSprite) {
								// console.log(`stop`)
								sprite.stop();
								sprite.currentFrame = 0;
							}
						}
					}
				}
			}

			const entityIDs = Object.keys($viewState.entities);
			for (const entityID of entityIDs) {
				processed.add(entityID);

				const entity = $viewState.entities[entityID];
				let gameObject = gameObjects[entityID];
				if (!gameObject) {
					gameObject = onEntityAdded(entityID, entity);
				} else {
					// was already present
				}

				if (gameObject instanceof AvatarObject) {
					if (entityID == $viewState.avatar?.id) {
						gameObject.markAsPlayerControlled(true);
					} else {
						gameObject.markAsPlayerControlled(false);
					}
				}

				// anyway we update the value
				updateEntity(entityID, gameObject, entity);
			}

			// Check for removals
			const avatarObjectIDs = Object.keys(gameObjects);
			for (const avatarObjectID of avatarObjectIDs) {
				if (!processed.has(avatarObjectID)) {
					onEntityRemoved(avatarObjectID, gameObjects[avatarObjectID]);
				}
			}
		});
	}

	function onAppStopped() {
		keyboardController.stop();
		gamepadController.stop();
		operations.stopListening();

		unsubscribe?.();
		cameraUnsubscribe?.();
	}

	// Per-frame update for all game objects
	function tick() {
		for (const id in gameObjects) {
			const gameObject = gameObjects[id];
			if (gameObject.tick) {
				gameObject.tick();
			}
		}
	}

	return {
		onAppStarted,
		onAppStopped,
		tick,
	};
}

export type Renderer = ReturnType<typeof createRenderer>;
