<script lang="ts">
	import ConnectionFlow from '$lib/connection/ConnectionFlow.svelte';
	import WebGlCanvas from '$lib/render/WebGLCanvas.svelte';
	import TopBar from '$lib/ui/structure/TopBar.svelte';
</script>

<main>
	<div class="pointer-events">
		<TopBar />
	</div>
</main>

<ConnectionFlow />

<div class="canvas">
	<WebGlCanvas />
</div>

<style>
	main {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.pointer-events {
		pointer-events: all;
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
