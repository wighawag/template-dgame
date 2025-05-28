<script lang="ts">
	import { Viewport } from 'pixi-viewport';
	import { Application, Graphics } from 'pixi.js';
	import { initDevtools } from '@pixi/devtools';
	import { onMount } from 'svelte';

	function buildGrid(graphics: Graphics, witdh: number, height: number, cellSize: number) {
		const numRows = Math.floor(height / cellSize) + 1;
		const numCols = Math.floor(witdh / cellSize) + 1;
		for (let i = 0; i < numCols; i++) {
			graphics.moveTo(i * cellSize, 0).lineTo(i * cellSize, height);
		}

		for (let i = 0; i < numRows; i++) {
			graphics.moveTo(0, i * cellSize).lineTo(witdh, i * cellSize);
		}

		return graphics;
	}

	function buildTriangleMeshGrid(
		graphics: Graphics,
		width: number,
		height: number,
		triangleEdgeSize: number
	) {
		// Calculate the distance between parallel lines
		// For equilateral triangles, the height is √3/2 times the side length
		const verticalSpacing = (Math.sqrt(3) / 2) * triangleEdgeSize;

		// Calculate number of lines needed
		const numHorizontalLines = Math.floor(height / verticalSpacing) + 2;
		const numDiagonalLines = Math.floor((width + height) / triangleEdgeSize) + 2;

		// Draw horizontal lines
		for (let i = 0; i < numHorizontalLines; i++) {
			const y = i * verticalSpacing;
			graphics.moveTo(0, y).lineTo(width, y);
		}

		// Draw diagonal lines going down-right (/)
		for (let i = -numDiagonalLines; i < numDiagonalLines; i++) {
			const startX = i * triangleEdgeSize;
			graphics.moveTo(startX, 0).lineTo(startX + height / Math.sqrt(3), height);
		}

		// Draw diagonal lines going down-left (\)
		for (let i = -numDiagonalLines; i < numDiagonalLines; i++) {
			const startX = i * triangleEdgeSize + width;
			graphics.moveTo(startX, 0).lineTo(startX - height / Math.sqrt(3), height);
		}

		return graphics;
	}

	let canvas: HTMLCanvasElement;
	let viewport: Viewport;
	onMount(() => {
		function resizeViewport() {
			viewport && viewport.resize();
		}
		const sizeObserver = new ResizeObserver(resizeViewport);
		sizeObserver.observe(canvas);
		console.log(`Mounting PixiCanvas......`);
		const app = new Application();
		initDevtools({ app });

		let initialised = false;
		const appInitialising = app.init({
			resizeTo: canvas,
			canvas,
			backgroundAlpha: 1,
			backgroundColor: 'black'
		});
		appInitialising.then(() => {
			initialised = true;
			// create viewport
			viewport = new Viewport({
				events: app.renderer.events, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
				allowPreserveDragOutside: true
			});
			viewport.moveCenter(0, 0);

			// add the viewport to the stage
			app.stage.addChild(viewport);

			const minWidth = 10;
			const minHeight = 10;
			const maxWidth = 100;
			const maxHeight = 100;

			// activate plugins
			viewport.drag().pinch().wheel().clampZoom({
				maxWidth,
				maxHeight,
				minHeight,
				minWidth
			});

			viewport.fit(true, 20, 20);

			const cellSize = 10;
			const gridSize = Math.max(maxWidth, maxHeight) + 2 * cellSize;

			const gridPixel = buildTriangleMeshGrid(new Graphics(), gridSize, gridSize, cellSize).stroke({
				color: 0xffffff,
				pixelLine: true,
				width: 1
			});

			viewport.addChild(gridPixel);

			// Listen for animate update
			app.ticker.add((time) => {
				// Just for fun, let's rotate mr rabbit a little.
				// * Delta is 1 if running at 100% performance *
				// * Creates frame-independent transformation *
				// bunny.rotation += 0.1 * time.deltaTime;

				// Apply modulo to create an infinite scrolling grid that follows viewport
				// Get the current viewport position
				const viewportX = viewport.x;
				const viewportY = viewport.y;
				const scale = viewport.scaled;

				const offsetX = viewportX / scale;
				const offsetY = viewportY / scale;

				// Position the grid to follow viewport but with modulo effect
				gridPixel.x = -offsetX - cellSize + (offsetX % cellSize);
				gridPixel.y = -offsetY - cellSize + (offsetY % cellSize);

				gridPixel.alpha = viewport.scaled / 48;
			});
		});

		return () => {
			sizeObserver.disconnect();
			console.log(`Unmounting PixiCanvas...`);
			if (initialised) {
				console.log(`destroying Pixi Application...`);
				app.destroy();
			} else {
				console.log(`unmounting while app was not initialised, waiting for it...`);
				appInitialising.then(() => {
					console.log(`destroying Pixi Application...`);
					app.destroy();
				});
			}
		};
	});
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		background-color: var(--canvas-bg-color, black);
		position: absolute;
		width: 100%;
		height: 100%;
		pointer-events: auto;
	}
</style>
