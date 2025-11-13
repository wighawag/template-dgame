<script lang="ts">
	import { localState } from '$lib/private/localState';
	import Button from '../generic/Button.svelte';
</script>

{#if $localState.signer && !$localState.tutorialSeen}
	<!-- <div class="absolute left-0 top-0 z-50 h-full w-full bg-amber-950">
		<h1>Welcome to </h1>

		<p>
			
		</p>

		<Button onclick={() => localState.markTutorialAsSeen()}>ok</Button>
	</div> -->
{/if}
