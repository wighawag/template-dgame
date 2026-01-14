<script lang="ts">
	import {setUserContext} from '$lib';
	import ConnectionFlow from '$lib/core/connection/ConnectionFlow.svelte';
	import WalletOnlyConnectionFlow from '$lib/core/connection/WalletOnlyConnectionFlow.svelte';
	import PixiCanvas from '$lib/core/render/PixiCanvas.svelte';
	import {eventEmitter} from '$lib/render/eventEmitter.js';
	import type {GameDependencies} from '$lib/types';
	import GameClock from '$lib/ui/GameClock.svelte';
	import GameInfo from '$lib/ui/GameInfo.svelte';
	import EnterFlow from '$lib/ui/flows/enter/EnterFlow.svelte';
	import PurchaseFlow from '$lib/ui/flows/purchase/PurchaseFlow.svelte';
	import TopBar from '$lib/ui/structure/TopBar.svelte';
	import Tutorial from '$lib/ui/tutorial/Tutorial.svelte';

	interface Props {
		dependencies: GameDependencies;
	}

	let {dependencies}: Props = $props();
	setUserContext(() => dependencies);

	let {connection, paymentConnection, cameraControl, renderer} =
		$derived(dependencies);
</script>

<main>
	<div class="pointer-events-auto">
		<TopBar />
	</div>
	<div class="mt-16 ml-2"><GameClock /></div>
</main>

<EnterFlow />

<PurchaseFlow />

<ConnectionFlow {connection} />
<WalletOnlyConnectionFlow connection={paymentConnection} />

<div class="canvas">
	<PixiCanvas
		{cameraControl}
		{renderer}
		{eventEmitter}
		cellSize={10}
		showGrid={false}
	/>
</div>

<GameInfo />

<div id="navigation" class="navigation">
	<div class="actions">
		<button onclick={() => eventEmitter.emit('backspace')}>&lt;</button>
		<!-- <button class="invisible" onclick={() => eventEmitter.emit('backspace')}>&lt;&lt;</button> -->
		<button onclick={() => eventEmitter.emit('action')}>instant / exit</button>
		<button onclick={() => eventEmitter.emit('action-2')}>delayed</button>
	</div>
	<div class="line"></div>

	<div class="north">
		<button onclick={() => eventEmitter.emit('up')}>N</button>
	</div>
	<div class="west-south-east">
		<button onclick={() => eventEmitter.emit('left')}>W</button>
		<button onclick={() => eventEmitter.emit('down')}>S</button>
		<button onclick={() => eventEmitter.emit('right')}>E</button>
	</div>
</div>

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

	.navigation {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-content: flex-start;
		position: absolute;
		bottom: 64px;
		right: 0;
		width: 14rem;
	}
	.north {
		display: flex;
		justify-content: center;
		flex-basis: 100%;
		gap: 1rem;
	}
	.west-south-east {
		display: flex;
		justify-content: center;
		flex-basis: 100%;
		gap: 1rem;
	}
	button {
		width: 4rem;
		height: 4rem;
		background-color: black;
		opacity: 0.65;
		border: 2px solid white;
		color: white;
	}

	.actions {
		display: flex;
		justify-content: center;
		flex-basis: 100%;
		gap: 1rem;
	}

	.line {
		display: flex;
		justify-content: center;
		flex-basis: 100%;
		gap: 1rem;
		height: 1rem;
	}
</style>
