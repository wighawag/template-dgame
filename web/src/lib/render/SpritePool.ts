import {AnimatedSprite, Sprite} from 'pixi.js';
import {TileSpritesheet, TileType} from './TileSpritesheet';

export class TileSpritePool {
	private pools: Map<TileType, Sprite[]> = new Map();
	private activeSprites: Set<Sprite> = new Set();

	constructor() {
		// Initialize pools for each tile type
		const tileTypes = [
			TileType.Empty,
			TileType.Wall,
			TileType.Box,
			TileType.Exit,
		];

		for (const type of tileTypes) {
			this.pools.set(type, []);
		}
	}

	getSprite(type: TileType): Sprite {
		const pool = this.pools.get(type)!;
		let sprite = pool.pop();

		if (!sprite) {
			const texture = TileSpritesheet.getTexture(type);
			if (!texture) {
				throw new Error(`Texture not found for tile type: ${type}`);
			}
			if (Array.isArray(texture)) {
				sprite = new AnimatedSprite({
					textures: texture,
					roundPixels: true,
					animationSpeed: 0.2,
				});
				// (sprite as AnimatedSprite).play();
			} else {
				sprite = new Sprite({texture, roundPixels: true});
			}
			sprite.width = 10;
			sprite.height = 10;
			sprite.anchor.set(0, 0); // Top-left anchor for grid positioning
			if (type == TileType.Wall) {
				sprite.anchor.set(0, 16 / 48);

				sprite.height = (10 * 48) / 32;
			} else if (type == TileType.Box) {
				sprite.anchor.set(0, 14 / 46);
				sprite.height = (10 * 46) / 32;
			}
		}

		sprite.visible = true;
		(sprite as any).type = type;

		this.activeSprites.add(sprite);
		return sprite;
	}

	returnSprite(sprite: Sprite): void {
		if (this.activeSprites.has(sprite)) {
			this.activeSprites.delete(sprite);
			sprite.visible = false;
			sprite.parent?.removeChild(sprite);

			// Determine the sprite type based on its texture
			const type = (sprite as any).type;
			if (type !== undefined) {
				const pool = this.pools.get(type)!;
				pool.push(sprite);
			}
		}
	}

	returnAll(): void {
		// Return all active sprites to their pools
		const spritesToReturn = Array.from(this.activeSprites);
		for (const sprite of spritesToReturn) {
			this.returnSprite(sprite);
		}
	}

	getActiveCount(): number {
		return this.activeSprites.size;
	}

	getPoolSize(type: TileType): number {
		return this.pools.get(type)?.length || 0;
	}

	clear(): void {
		this.returnAll();

		// Clear all pools
		for (const pool of this.pools.values()) {
			pool.length = 0;
		}
	}
}
