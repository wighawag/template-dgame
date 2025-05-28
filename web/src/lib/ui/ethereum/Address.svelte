<script lang="ts">
	import { wait } from '$lib/utils/time';
	import { onMount } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { createPublicClient, http } from 'viem';
	import { mainnet } from 'viem/chains';

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
		// await wait(2);
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
	<span class="flex flex-1 justify-end">
		{#if loading}
			<span
				class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800 align-middle"
				aria-label="Loading ENS name..."
			></span>
		{/if}
	</span>
</span>
