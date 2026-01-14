<script lang="ts">
	import {browser} from '$app/environment';
	import {createGameDependenciesForEmbeddedPlay} from '$lib';
	import GameScreenLoader from '$lib/screens/GameScreenLoader.svelte';
</script>

{#if browser}
	<GameScreenLoader
		createGameDependencies={createGameDependenciesForEmbeddedPlay}
	/>
{/if}
