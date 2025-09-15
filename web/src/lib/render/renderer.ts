import { Blockie } from '$lib/utils/ethereum/blockie';
import { viewState, type ViewEntity, type ViewState } from '$lib/view';
import { Container, Graphics } from 'pixi.js';
import type { Readable } from 'svelte/store';
import { LoadingSprite } from './LoadingSprite';
import { epochInfo, time } from '$lib/time';
import gsap from 'gsap';

export function createRenderer(viewState: Readable<ViewState>) {
	let displayObjects: { [id: string]: Container } = {};
	let unsubscribe: (() => void) | undefined = undefined;

	function onAppStarted(container: Container) {
		const entrance = new Graphics().rect(-4, -4, 8, 8).fill(0xffff34);
		entrance.alpha = 0.4;
		container.addChild(entrance);

		let pathDisplayObject = new Container();
		container.addChild(pathDisplayObject);
		pathDisplayObject.zIndex = 1;

		unsubscribe = viewState.subscribe(($viewState) => {
			const now = time.now();
			const $epochInfo = epochInfo.fromTime(now);

			const { currentEpoch: epoch } = $epochInfo;
			const processed = new Set();

			function onEntityAdded(id: string, entity: ViewEntity): Container {
				const displayObject = new Container();
				if (entity.type == 'avatar') {
					const sprite = new LoadingSprite(Blockie.getURI(entity.id));
					// const graphics = new Graphics().rect(0, 0, 10, 10).fill(0xff0000);
					// displayObject.addChild(graphics);
					displayObject.addChild(sprite);
					sprite.x = -5 + 2;
					sprite.y = -5 + 2;
					sprite.scale = 6 / 8;

					{
						const graphics = new Graphics()
							.rect(-5, -5, 10, 10)
							.stroke({ width: 1, color: 0x00ff00 });
						displayObject.addChild(graphics);
						graphics.visible = false;
					}
					{
						const graphics = new Graphics()
							.rect(-5, -5, 10, 10)
							.stroke({ width: 1, color: 0xff0000 });
						displayObject.addChild(graphics);
						graphics.visible = false;
					}

					{
						const graphics = new Graphics()
							.moveTo(0, 0)
							.lineTo(10, 10)
							.moveTo(0, 10)
							.lineTo(10, 0)
							.stroke({ width: 1, color: 0xff0000 });
						displayObject.addChild(graphics);
						graphics.visible = false;
					}
				} else {
					console.error(`no render for entity type : ${(entity as any).type}`);
				}

				updateEntity(id, displayObject, entity);

				container.addChild(displayObject);
				displayObjects[id] = displayObject;
				return displayObject;
			}

			function onEntityRemoved(id: string, displayObject: Container) {
				// TODO removal type ?
				container.removeChild(displayObject);
			}

			function updateEntity(id: string, displayObject: Container, entity: ViewEntity) {
				if (entity.type === 'avatar') {
					displayObject.zIndex = 0;

					if (entity.life == 0) {
						displayObject.children[3].visible = true;
					} else {
						displayObject.children[3].visible = false;
					}

					displayObject.children[1].visible = false;
					displayObject.children[2].visible = false;

					if (id == $viewState.avatarID) {
						displayObject.zIndex = 2;
						// TODO move that elseewhere and remove the need to delete all and reconstruct
						// Make sure to destroy all children first to prevent memory leaks
						pathDisplayObject.removeChildren();

						const path = entity.path;
						if (path) {
							for (const pos of path) {
								const graphics = new Graphics();
								pathDisplayObject
									.addChild(graphics)
									.rect(-5 + 4, -5 + 4, 2, 2)
									.fill(0x00ff00);
								graphics.x = 10 * pos.x;
								graphics.y = 10 * pos.y;
							}
						}

						// if (entity.epoch > time.now() - 0.9) {
						// 	displayObject.children[1].visible = false;
						// 	displayObject.children[2].visible = true;
						// } else {
						displayObject.children[1].visible = true;
						displayObject.children[2].visible = false;
						// }

						displayObject.x = 10 * entity.position.x;
						displayObject.y = 10 * entity.position.y;
					} else {
						const destination = {
							x: 10 * entity.position.x,
							y: 10 * entity.position.y
						};
						if (entity.path.length > 0) {
							console.log(entity.path);
							// if (10 * entity.position.x != displayObject.)
							//old way (without plugin):
							gsap.to(displayObject.position, { x: destination.x, y: destination.y, duration: 1 });
							// gsap.to(displayObject.position, { x: (30 * Math.PI) / 180, duration: 1 });
						} else {
							displayObject.x = destination.x;
							displayObject.y = destination.y;
						}
					}
				}
			}

			const entityIDs = Object.keys($viewState.entities);
			for (const entityID of entityIDs) {
				processed.add(entityID);

				const entity = $viewState.entities[entityID];
				let displayObject = displayObjects[entityID];
				if (!displayObject) {
					displayObject = onEntityAdded(entityID, entity);
				} else {
					// was already present
				}
				// anyway we update the value
				updateEntity(entityID, displayObject, entity);
			}

			// Check for removals
			const displayObjectIDs = Object.keys(displayObjects);
			for (const displayObjectID of displayObjectIDs) {
				if (!processed.has(displayObjectID)) {
					onEntityRemoved(displayObjectID, displayObjects[displayObjectID]);
				}
			}
		});
	}

	function onAppStopped() {
		unsubscribe?.();
	}

	return {
		onAppStarted,
		onAppStopped
	};
}

export const renderer = createRenderer(viewState);

export type Renderer = ReturnType<typeof createRenderer>;
