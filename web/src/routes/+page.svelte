<script lang="ts">
	import { connection, paymentConnection } from '$lib/core/connection';
	import ConnectionFlow from '$lib/core/connection/ConnectionFlow.svelte';
	import WalletOnlyConnectionFlow from '$lib/core/connection/WalletOnlyConnectionFlow.svelte';
	import PixiCanvas from '$lib/core/render/PixiCanvas.svelte';
	import { cameraControl } from '$lib/core/render/camera.js';
	import GameClock from '$lib/ui/GameClock.svelte';
	import TopBar from '$lib/ui/structure/TopBar.svelte';
	import { eventEmitter } from '$lib/render/eventEmitter.js';
	import { renderer } from '$lib/render/renderer.js';
	import GameInfo from '$lib/ui/GameInfo.svelte';
	import Tutorial from '$lib/ui/tutorial/Tutorial.svelte';
	import { browser } from '$app/environment';
</script>

<main>
	<div class="pointer-events-auto">
		<TopBar />
	</div>
	<div class="mt-16 ml-2"><GameClock /></div>
</main>

<ConnectionFlow {connection} />
<WalletOnlyConnectionFlow connection={paymentConnection} />

<div class="canvas">
	{#if browser}
		<PixiCanvas {cameraControl} {renderer} {eventEmitter} cellSize={10} showGrid={false} />
	{/if}
</div>

<GameInfo />

<Tutorial />

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
