<script lang="ts">
	import Dialog from '$lib/components/Dialog/Dialog.svelte';
	import type { ComponentProps, Snippet } from 'svelte';
	type DialogProps = ComponentProps<typeof Dialog>;

	interface Props extends DialogProps {
		openOn: boolean;
		onCancel?: () => void;
	}

	let { openOn, onCancel, ...rest }: Props = $props();
</script>

<Dialog
	{openOn}
	onOpenChange={(open) => {
		if (!open) {
			onCancel && onCancel();
		}
	}}
	contentProps={{
		interactOutsideBehavior: onCancel ? 'close' : 'ignore',
		escapeKeydownBehavior: onCancel ? 'close' : 'ignore',
		onOpenAutoFocus: (e) => {
			e.preventDefault();
			// TODO option
			const element = document.getElementById('ConnectionFlow_email');
			element?.focus();
		}
	}}
	{...rest}
></Dialog>
