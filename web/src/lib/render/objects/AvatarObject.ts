import type { AvatarEntity } from '$lib/onchain/types';
import { LoadingSprite } from '../LoadingSprite';
import { Blockie } from '$lib/utils/ethereum/blockie';
import { GameObject } from './GameObject';
import { Container, Graphics } from 'pixi.js';

import gsap from 'gsap';

export class AvatarObject extends GameObject {
	protected playerControlled: boolean = false;
	protected epochAnim:
		| {
				timeline: gsap.core.Timeline;
				epoch: number;
		  }
		| undefined;
	constructor(
		protected world: { pathDisplayObject: Container },
		protected entity: AvatarEntity
	) {
		super();
		const sprite = new LoadingSprite(Blockie.getURI(entity.id));
		this.addChild(sprite);
		sprite.x = -5 + 2;
		sprite.y = -5 + 2;
		sprite.scale = 6 / 8;

		{
			const graphics = new Graphics().rect(-5, -5, 10, 10).stroke({ width: 1, color: 0x00ff00 });
			this.addChild(graphics);
			graphics.visible = false;
		}
		{
			const graphics = new Graphics().rect(-5, -5, 10, 10).stroke({ width: 1, color: 0xff0000 });
			this.addChild(graphics);
			graphics.visible = false;
		}

		{
			const graphics = new Graphics()
				.moveTo(0, 0)
				.lineTo(10, 10)
				.moveTo(0, 10)
				.lineTo(10, 0)
				.stroke({ width: 1, color: 0xff0000 });
			this.addChild(graphics);
			graphics.visible = false;
		}
	}

	update(entity: AvatarEntity, epoch: number) {
		this.entity = entity;

		this.zIndex = 0;

		if (entity.life == 0) {
			this.children[3].visible = true;
		} else {
			this.children[3].visible = false;
		}

		this.children[1].visible = false;
		this.children[2].visible = false;

		if (this.playerControlled) {
			this.zIndex = 2;
			// TODO move that elseewhere and remove the need to delete all and reconstruct
			// Make sure to destroy all children first to prevent memory leaks
			this.world.pathDisplayObject.removeChildren();

			const path = entity.path;
			if (path) {
				for (const pos of path) {
					const graphics = new Graphics();
					this.world.pathDisplayObject
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
			this.children[1].visible = true;
			this.children[2].visible = false;
			// }

			this.x = 10 * entity.position.x;
			this.y = 10 * entity.position.y;
		} else {
			const destination = {
				x: 10 * entity.position.x,
				y: 10 * entity.position.y
			};

			if (entity.path.length > 0 && (!this.epochAnim || this.epochAnim.epoch !== epoch)) {
				const duration = 0.2;
				const tl = gsap.timeline();
				for (const p of entity.path) {
					tl.to(this.position, { x: 10 * p.x, y: 10 * p.y, duration });
				}
				this.epochAnim = {
					epoch,
					timeline: tl
				};
			} else {
				this.x = destination.x;
				this.y = destination.y;
			}
		}
	}

	markAsPlayerControlled(isPlayerControlled: boolean) {
		this.playerControlled = isPlayerControlled;
	}
}
