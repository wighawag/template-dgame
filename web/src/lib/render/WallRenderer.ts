import type {Camera} from '$lib/core/render/camera';
import {Container} from 'pixi.js';

// Cell types based on the ASCII parsing
export enum CellType {
	Empty = 0,
	Wall = 1,
	Box = 2,
	Exit = 3,
}

export interface AreaData {
	cells: number[];
	size: number;
}

export interface WorldPosition {
	x: number;
	y: number;
}

export type WallRenderer = Container & {
	initialize(): Promise<void>;
	update(camera: Camera): void;
	destroy(): void;
	// getActiveTileCount(): number;
};
