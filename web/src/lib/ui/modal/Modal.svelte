<script lang="ts">
	import Modal from '$lib/components/Modal/Modal.svelte';
	import type { ComponentProps, Snippet } from 'svelte';
	type ModalProps = ComponentProps<typeof Modal>;

	interface Props
		extends Omit<
			ModalProps,
			'open' | 'onOpenChange' | 'closeOnInteractOutside' | 'closeOnEscape' | 'content' | 'trigger'
		> {
		children: Snippet;
		openOn: boolean;
		onCancel?: () => void;
	}

	let {
		children,
		openOn,
		onCancel,
		triggerBase = 'btn preset-tonal',
		contentBase = 'card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm',
		backdropBackground = '',
		backdropClasses = '',
		positionerClasses = 'backdrop-blur-sm bg-surface-50/75 dark:bg-surface-950/75',
		...rest
	}: Props = $props();
</script>

<Modal
	open={openOn}
	onOpenChange={(event) => {
		if (!event.open) {
			onCancel && onCancel();
		}
	}}
	closeOnInteractOutside={onCancel ? true : false}
	closeOnEscape={onCancel ? true : false}
	{triggerBase}
	{contentBase}
	{backdropClasses}
	{positionerClasses}
	{backdropBackground}
	{...rest}
>
	{#snippet content()}
		{@render children()}
	{/snippet}
</Modal>
