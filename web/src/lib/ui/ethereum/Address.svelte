<script lang="ts">
	import { wait } from '$lib/utils/time';
	import { onMount } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { createPublicClient, http } from 'viem';
	import { mainnet } from 'viem/chains';
	import { Copy, Check, LoaderCircle } from '@lucide/svelte';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		value: `0x${string}`;
		start?: number;
		end?: number;
	}
	let { value, start = 4, end = 4, ...restProps }: Props = $props();

	const publicClient = createPublicClient({
		chain: mainnet,
		transport: http()
	});

	let ensName: string | null = $state(null);
	let loading = $state(false);
	let copied = $state(false);

	onMount(() => {
		if (value) {
			fetchENS();
		}
	});

	async function fetchENS() {
		if (!value) {
			return;
		}
		loading = true;
		ensName = null;
		try {
			ensName = await publicClient.getEnsName({ address: value });
		} catch (e) {
			ensName = null;
		}
		loading = false;
	}

	function formatAddress(addr: string) {
		if (!addr) return '';
		return `${addr.slice(0, start)}...${addr.slice(-end)}`;
	}

	async function copyAddress(event: MouseEvent) {
		event.stopPropagation();
		await navigator.clipboard.writeText(value);
		copied = true;
		setTimeout(() => (copied = false), 1000);
	}
</script>

<span {...restProps} class="inline-flex w-full min-w-[8em] items-center">
	<span class="flex-1"></span>
	<span class="flex-0 text-center">
		{#if ensName}
			{ensName}
		{:else}
			{formatAddress(value)}
		{/if}
	</span>
	<span class="flex flex-1 items-center justify-end gap-1">
		{#if loading}
			<LoaderCircle class="w-4 animate-spin" />
		{:else}
			<button
				type="button"
				class="ml-2 rounded p-1 hover:bg-gray-200"
				title="Copy address"
				onclick={copyAddress}
				aria-label="Copy address"
			>
				{#if copied}
					<Check class="w-4 text-green-500" />
				{:else}
					<Copy class="w-4" />
				{/if}
			</button>
		{/if}
	</span>
</span>
