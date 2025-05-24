<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Dialog, Separator, type WithoutChild } from 'bits-ui';
	import { fade, fly, scale, slide } from 'svelte/transition';

	interface Props extends Omit<Dialog.RootProps, 'open' | 'description' | 'title'> {
		title: Snippet;
		contentProps?: WithoutChild<Dialog.ContentProps>;
		openOn: boolean; // TODO name it openWhen
	}

	let { openOn = $bindable(false), children, contentProps, title, ...restProps }: Props = $props();

	const overlayCoreClass = `fixed inset-0`;
	const contentCoreClass =
		'fixed top-[50%] left-[50%] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] p-5 sm:max-w-[490px]';
</script>

<Dialog.Root bind:open={openOn} {...restProps}>
	<Dialog.Portal>
		<Dialog.Overlay class={`${overlayCoreClass} bg-black/80`} />
		<Dialog.Content forceMount class={`${contentCoreClass} border bg-black `} {...contentProps}>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} transition:fly={{ duration: 300, y: '100%' }}>
						<Dialog.Title
							class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
						>
							{@render title()}
						</Dialog.Title>
						<Separator.Root class="bg-muted -mx-5 mb-6 mt-5 block h-px" />
						{@render children?.()}
					</div>
				{/if}
			{/snippet}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
