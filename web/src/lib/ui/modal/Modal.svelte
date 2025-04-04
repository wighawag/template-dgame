<script module lang="ts">
	let lastId: number = 0;
</script>

<script lang="ts">
	import { machine, connect, type Service, type Api } from '@zag-js/dialog';
	import { portal, normalizeProps, useMachine } from '@zag-js/svelte';
	import { type Snippet } from 'svelte';

	interface Props {
		oncancel?: () => void;
		children?: Snippet;
		title: string;
		description?: string;
	}
	let { oncancel, children, title, description }: Props = $props();

	let closeButton: HTMLButtonElement;

	const service: Service = useMachine(machine, {
		id: (++lastId).toString(),
		// role: 'alertdialog',
		defaultOpen: true,
		onOpenChange(details) {
			oncancel && oncancel();
		},
		initialFocusEl: () => closeButton,

		onInteractOutside: (event) => {
			event.preventDefault();
			oncancel && oncancel();
		}
	});
	const api: Api = $derived(connect(service, normalizeProps));
</script>

<div use:portal {...api.getBackdropProps()}></div>
<div use:portal {...api.getPositionerProps()}>
	<div {...api.getContentProps()}>
		<h2 {...api.getTitleProps()}>{title}</h2>
		{#if description}
			<p {...api.getDescriptionProps()}>
				{description}
			</p>
		{/if}
		<div>
			{@render children?.()}
		</div>
		{#if oncancel}
			<button bind:this={closeButton} onclick={oncancel}>Close</button>
		{/if}
	</div>
</div>

<style>
	/* @keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 0.2;
		}
	} */

	[data-part='positioner'] {
		position: fixed;
		inset: 0;
		height: fit-content;
		width: fit-content;
		min-width: 300px;
		min-height: 300px;
		background-color: white;
		margin: auto;
		padding: 20px;
		border-radius: 4px;
		overflow: visible;
		z-index: 1001;
	}

	[data-part='backdrop'] {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 1000;
	}

	/* [data-part='content'] {
		
	} */

	/* [data-part='title'] {
		
	} */

	/* [data-part='description'] {
	
	} */

	/* [data-part='close-trigger'] {
	
	} */
</style>
