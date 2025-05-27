<script lang="ts">
	import Dialog from '$lib/components/Dialog/Dialog.svelte';
	import { tick, type ComponentProps } from 'svelte';
	type DialogProps = ComponentProps<typeof Dialog>;

	interface Props extends Omit<DialogProps, 'openOn' | 'onCancel' | 'onOpenChange'> {
		openOn: boolean;
		onCancel?: () => void;
	}

	let { openOn, onCancel, ...rest }: Props = $props();

	let focusedElementWhenOpened: HTMLElement | null = $state(null);
</script>

<Dialog
	{openOn}
	onOpenChange={(open) => {
		console.log('onOpenChange', open);
		if (!open) {
			onCancel?.();
			console.log(focusedElementWhenOpened);
			// debugger;
			tick().then(() => focusedElementWhenOpened?.focus());
			// setTimeout(() => focusedElementWhenOpened?.focus(), 1);
		}
	}}
	contentProps={{
		interactOutsideBehavior: onCancel ? 'close' : 'ignore',
		escapeKeydownBehavior: onCancel ? 'close' : 'ignore',
		onOpenAutoFocus: (e) => {
			e.preventDefault();
			console.log('onOpenAutoFocus', document.querySelector(':focus-visible'));
			focusedElementWhenOpened = document.querySelector(':focus-visible');

			// TODO option
			const element = document.getElementById('ConnectionFlow_email');
			element?.focus();
		},
		onCloseAutoFocus: (e) => {
			e.preventDefault();
			console.log('onOpenAutoFocus', document.querySelector(':focus-visible'));

			console.log(focusedElementWhenOpened);
			focusedElementWhenOpened?.focus();
		}
	}}
	{...rest}
></Dialog>
