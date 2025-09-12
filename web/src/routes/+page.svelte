<script lang="ts">
	import ConnectionFlow from '$lib/connection/ConnectionFlow.svelte';
	import TopBar from '$lib/ui/structure/TopBar.svelte';
	import PixiCanvas from '$lib/render/PixiCanvas.svelte';
	import { camera } from '$lib/render/camera.js';
	import { renderer } from '$lib/render/renderer.js';
	import { eventEmitter } from '$lib/render/eventEmitter.js';
	import EnterFlow from '$lib/ui/flows/enter/EnterFlow.svelte';
	import PurchaseFlow from '$lib/ui/flows/purchase/PurchaseFlow.svelte';
	import GameClock from '$lib/time/GameClock.svelte';
</script>

<main>
	<div class="pointer-events-auto">
		<TopBar />
	</div>
	<div class="ml-2 mt-16"><GameClock /></div>
</main>

<EnterFlow />

<PurchaseFlow />

<ConnectionFlow />

<div class="canvas">
	<PixiCanvas {camera} {renderer} {eventEmitter} />
</div>

<style>
	main {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.canvas {
		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
	}
</style>
