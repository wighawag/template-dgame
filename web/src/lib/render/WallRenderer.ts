import { Container, Graphics } from 'pixi.js';
import type { Camera } from './camera';
import { Areas, ZONE_SIZE } from 'dgame-contracts';
import { zoneLocalCoord } from 'dgame-contracts';

// Cell types based on the ASCII parsing
export enum CellType {
	Empty = 0,
	Wall = 1,
	Box = 2,
	Exit = 3
}

export interface AreaData {
	cells: number[];
	size: number;
}

export interface WorldPosition {
	x: number;
	y: number;
}

export class WallRenderer {
	private container: Container;
	private wallGraphics: Graphics;
	private boxGraphics: Graphics;
	private exitGraphics: Graphics;
	private cellSize: number;
	private visibleWalls: Set<string> = new Set();
	private visibleBoxes: Set<string> = new Set();
	private visibleExits: Set<string> = new Set();

	public zIndex: number = 0;

	constructor(container: Container, cellSize: number) {
		this.container = container;
		this.cellSize = cellSize;

		// Create graphics for walls and boxes
		this.wallGraphics = new Graphics();
		this.boxGraphics = new Graphics();
		this.exitGraphics = new Graphics();
		this.container.addChild(this.wallGraphics);
		this.container.addChild(this.boxGraphics);
		this.container.addChild(this.exitGraphics);
	}

	private getCellAt(worldX: number, worldY: number): CellType {
		// Use the same zoneLocalCoord function as game operations
		const areaLocalX = zoneLocalCoord(worldX);
		const areaLocalY = zoneLocalCoord(worldY);
		const cellIndex = areaLocalX + areaLocalY * ZONE_SIZE;

		// Use the same area as in operations (index 2) for consistency
		const area = Areas[2];
		return area.cells[cellIndex] as CellType;
	}

	private getVisibleBounds(camera: Camera): {
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
			endY: Math.ceil(camera.y + camera.height / 2 + margin)
		};
	}

	private getKey(x: number, y: number): string {
		return `${x},${y}`;
	}

	private drawWall(x: number, y: number) {
		// Match the grid offset from PixiCanvas: -cellSize - cellSize/2 + (offset % cellSize)
		const pixelX = x * this.cellSize - this.cellSize / 2;
		const pixelY = y * this.cellSize - this.cellSize / 2;

		this.wallGraphics.rect(pixelX, pixelY, this.cellSize, this.cellSize).fill(0x666666);
	}

	private drawBox(x: number, y: number) {
		// Match the grid offset from PixiCanvas: -cellSize - cellSize/2 + (offset % cellSize)
		const pixelX = x * this.cellSize - this.cellSize / 2;
		const pixelY = y * this.cellSize - this.cellSize / 2;

		this.boxGraphics.rect(pixelX, pixelY, this.cellSize, this.cellSize).fill(0x8b4513);
	}

	private drawExit(x: number, y: number) {
		// Match the grid offset from PixiCanvas: -cellSize - cellSize/2 + (offset % cellSize)
		const pixelX = x * this.cellSize - this.cellSize / 2;
		const pixelY = y * this.cellSize - this.cellSize / 2;

		this.exitGraphics.rect(pixelX, pixelY, this.cellSize, this.cellSize).fill(0xff0000);
	}

	private clearWalls() {
		this.wallGraphics.clear();
	}

	private clearBoxes() {
		this.boxGraphics.clear();
	}

	private clearExits() {
		this.exitGraphics.clear();
	}

	update(camera: Camera) {
		const bounds = this.getVisibleBounds(camera);
		const newWalls: Set<string> = new Set();
		const newBoxes: Set<string> = new Set();
		const newExits: Set<string> = new Set();

		// Clear old graphics and start fresh
		this.clearWalls();
		this.clearBoxes();
		this.clearExits();

		// Check each visible cell
		for (let x = bounds.startX; x <= bounds.endX; x++) {
			for (let y = bounds.startY; y <= bounds.endY; y++) {
				const cellType = this.getCellAt(x, y);
				const key = this.getKey(x, y);

				if (cellType === CellType.Wall) {
					this.drawWall(x, y);
					newWalls.add(key);
				} else if (cellType === CellType.Box) {
					this.drawBox(x, y);
					newBoxes.add(key);
				} else if (cellType === CellType.Exit) {
					this.drawExit(x, y);
					newExits.add(key);
				}
			}
		}

		this.visibleWalls = newWalls;
		this.visibleBoxes = newBoxes;
		this.visibleExits = newExits;
	}

	// Method to load actual areas from contracts in the future
	async loadAreas(areas: AreaData[]) {
		// This will be implemented when we have the Areas contract loaded
		console.log('Loading areas:', areas.length);
	}

	destroy() {
		this.container.removeChild(this.wallGraphics);
		this.container.removeChild(this.boxGraphics);
		this.wallGraphics.destroy();
		this.boxGraphics.destroy();
	}
}
