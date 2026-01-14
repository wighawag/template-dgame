import {
	AnimatedSprite,
	Assets,
	Container,
	Graphics,
	Sprite,
	Texture,
} from 'pixi.js';
import {GameObject} from './GameObject';

import type {AvatarViewEntity} from '$lib/view';
import gsap from 'gsap';
import {LoadingSprite} from '$lib/core/render/elements/LoadingSprite';
import {Blockie} from '$lib/core/utils/ethereum/blockie';

export class AvatarObject extends GameObject {
	protected playerControlled: boolean = false;
	protected epochAnim:
		| {
				timeline: gsap.core.Timeline;
				epoch: number;
		  }
		| undefined;

	protected sprite: LoadingSprite;
	protected greenSquare: Graphics;
	protected redSquare: Graphics;
	protected deadCross: Graphics;
	protected enteringSprite: Sprite;

	constructor(
		protected world: {
			pathDisplayObject: Container;
		},
		protected entity: AvatarViewEntity,
	) {
		super();
		this.sprite = new LoadingSprite(Blockie.getURI(entity.owner));
		this.sprite.zIndex = 1;
		this.addChild(this.sprite);
		this.sprite.x = -5 + 2;
		this.sprite.y = -5 + 2;
		this.sprite.scale = 6 / 8;

		{
			const textures: Texture[] = [];
			for (let i = 1; i <= 21; i++) {
				if (i < 10) {
					textures.push(Assets.get('sprites').textures[`entry_00${i}.png`]);
				} else {
					textures.push(Assets.get('sprites').textures[`entry_0${i}.png`]);
				}
			}

			this.enteringSprite = new AnimatedSprite({
				textures,
				animationSpeed: 0.15,
				loop: true,
				autoPlay: true,
			});
			this.enteringSprite.zIndex = 0;
			this.addChild(this.enteringSprite);
			this.enteringSprite.scale = 10 / 64;
			this.enteringSprite.anchor.set(0.5, 0.7);
			this.enteringSprite.visible = false;
		}

		this.greenSquare = new Graphics()
			.rect(-5, -5, 10, 10)
			.stroke({width: 1, color: 0x00ff00});
		this.addChild(this.greenSquare);
		this.greenSquare.visible = false;

		this.redSquare = new Graphics()
			.rect(-5, -5, 10, 10)
			.stroke({width: 1, color: 0xff0000});
		this.addChild(this.redSquare);
		this.redSquare.visible = false;

		this.deadCross = new Graphics()
			.moveTo(-5, -5)
			.lineTo(5, 5)
			.moveTo(-5, 5)
			.lineTo(5, -5)
			.stroke({width: 1, color: 0xff0000});
		this.addChild(this.deadCross);
		this.deadCross.zIndex = 2;
		this.deadCross.visible = false;
	}

	update(entity: AvatarViewEntity, epoch: number) {
		this.entity = entity;

		if (entity.life == 0) {
			this.deadCross.visible = true;
		} else {
			this.deadCross.visible = false;
		}

		this.greenSquare.visible = false;
		this.redSquare.visible = false;
		// this.deadCross.visible = true;

		if (this.playerControlled) {
			// this.zIndex = 2;
			// TODO move that elsewhere and remove the need to delete all and reconstruct
			// Make sure to destroy all children first to prevent memory leaks
			this.world.pathDisplayObject.removeChildren();

			const actions = entity.plannedActions;
			if (actions) {
				for (const action of actions) {
					if (action.type === 'move' || action.type === 'enter') {
						// Draw path movement (existing code)
						const graphics = new Graphics();
						this.world.pathDisplayObject
							.addChild(graphics)
							.rect(-5 + 4, -5 + 4, 2, 2)
							.fill(0x00ff00);
						graphics.x = 10 * action.x;
						graphics.y = 10 * action.y;
					}
				}
			}

			// if (entity.epoch > time.now() - 0.9) {
			// 	this.greenSquare.visible = false;
			// 	this.redSquare.visible = true;
			// } else {
			this.greenSquare.visible = true;
			this.redSquare.visible = false;
			// }
		}
		const destination = {
			x: 10 * entity.position.x,
			y: 10 * entity.position.y,
		};

		// console.log(`destination`, { x: entity.position.x, y: entity.position.y });

		const moveActions = entity.previousActions.filter((v) => v.type === 'move');
		if (
			moveActions.length > 0 &&
			!(this.position.x == destination.x && this.position.y == destination.y) &&
			(!this.epochAnim || this.epochAnim.epoch !== epoch)
		) {
			// TODO ignore non-move actions ? or deal with them differently
			const duration = moveActions.length > 20 ? 2.2 / moveActions.length : 0.2;
			const tl = gsap.timeline();
			for (const p of moveActions) {
				tl.to(this.position, {x: 10 * p.x, y: 10 * p.y, duration});
				// console.log(`step`, { x: p.x, y: p.y });
			}
			this.epochAnim = {
				epoch,
				timeline: tl,
			};
		} else {
			this.position.x = destination.x;
			this.position.y = destination.y;
		}

		if (entity.entering) {
			this.enteringSprite.visible = true;
			this.sprite.visible = false;
			this.greenSquare.visible = false;
		} else {
			this.enteringSprite.visible = false;
			this.sprite.visible = true;
		}
	}

	markAsPlayerControlled(isPlayerControlled: boolean) {
		if (!isPlayerControlled && this.playerControlled) {
			this.world.pathDisplayObject.removeChildren();
		}
		this.playerControlled = isPlayerControlled;
	}

	onRemoved() {
		if (this.playerControlled) {
			this.world.pathDisplayObject.removeChildren();
		}
	}
}
