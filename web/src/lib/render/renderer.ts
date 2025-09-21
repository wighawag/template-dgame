import { viewState, type ViewEntity, type ViewState } from '$lib/view';
import { Container, Graphics } from 'pixi.js';
import type { Readable } from 'svelte/store';
import { AvatarObject } from './objects/AvatarObject';

export function createRenderer(viewState: Readable<ViewState>) {
	let avatarObjects: { [id: string]: AvatarObject } = {};
	let unsubscribe: (() => void) | undefined = undefined;

	function onAppStarted(container: Container) {
		const entrance = new Graphics().rect(-4, -4, 8, 8).fill(0xffff34);
		entrance.alpha = 0.4;
		container.addChild(entrance);

		let pathDisplayObject = new Container();
		container.addChild(pathDisplayObject);
		pathDisplayObject.zIndex = 1;

		const world = {
			pathDisplayObject
		};

		unsubscribe = viewState.subscribe(($viewState) => {
			const processed = new Set();

			function onEntityAdded(id: string, entity: ViewEntity): AvatarObject {
				if (entity.type == 'avatar') {
					const avatarObject = new AvatarObject(world, entity);
					container.addChild(avatarObject);
					avatarObjects[id] = avatarObject;
					return avatarObject;
				} else {
					throw new Error(`no render for entity type : ${(entity as any).type}`);
				}
			}

			function onEntityRemoved(id: string, avatarObject: AvatarObject) {
				// TODO removal type ?
				container.removeChild(avatarObject);
			}

			function updateEntity(id: string, avatarObject: AvatarObject, entity: ViewEntity) {
				if (entity.type === 'avatar') {
					avatarObject.update(entity, $viewState.epoch);
				}
			}

			const entityIDs = Object.keys($viewState.entities);
			for (const entityID of entityIDs) {
				processed.add(entityID);

				const entity = $viewState.entities[entityID];
				let avatarObject = avatarObjects[entityID];
				if (!avatarObject) {
					avatarObject = onEntityAdded(entityID, entity);
				} else {
					// was already present
				}

				if (entityID == $viewState.avatarID) {
					avatarObject.markAsPlayerControlled(true);
				} else {
					avatarObject.markAsPlayerControlled(false);
				}
				// anyway we update the value
				updateEntity(entityID, avatarObject, entity);
			}

			// Check for removals
			const avatarObjectIDs = Object.keys(avatarObjects);
			for (const avatarObjectID of avatarObjectIDs) {
				if (!processed.has(avatarObjectID)) {
					onEntityRemoved(avatarObjectID, avatarObjects[avatarObjectID]);
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
