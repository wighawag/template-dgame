import {Assets, Texture} from 'pixi.js';

export enum TileType {
	Empty = 0,
	Wall = 1,
	Box = 2,
	Exit = 3,
}

export class TileSpritesheet {
	private static textures: Map<TileType, Texture> = new Map();
	private static loaded = false;

	public static async load(): Promise<void> {
		if (this.loaded) return;

		await Assets.loadBundle('default');
		this.loaded = true;
	}

	static cachedExit: any | undefined;
	public static getTexture(type: TileType): Texture | Texture[] | undefined {
		if (type == TileType.Empty) {
			return Assets.get('sprites').textures['Floor-0.png'];
		} else if (type == TileType.Box) {
			return Assets.get('sprites').textures['Box_Single.png'];
		} else if (type == TileType.Exit) {
			if (this.cachedExit) {
				return this.cachedExit;
			}
			const textures: Texture[] = [];
			for (let i = 1; i <= 21; i++) {
				if (i < 10) {
					textures.push(Assets.get('sprites').textures[`exit_00${i}.png`]);
				} else {
					textures.push(Assets.get('sprites').textures[`exit_0${i}.png`]);
				}
			}
			this.cachedExit = textures;
			return textures;
		} else if (type == TileType.Wall) {
			// TODO
			return Assets.get('sprites').textures['Wall_2_Single.png'];
		}
		return this.textures.get(type);
	}

	public static isLoaded(): boolean {
		return this.loaded;
	}
}
