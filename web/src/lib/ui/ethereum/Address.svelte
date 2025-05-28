<script lang="ts">
	import { onMount } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { createPublicClient, http } from 'viem';
	import { mainnet } from 'viem/chains';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		address: `0x${string}`;
		start?: number;
		end?: number;
	}
	let { address, start = 4, end = 4, ...restProps }: Props = $props();

	const publicClient = createPublicClient({
		chain: mainnet,
		transport: http()
	});

	let ensName: string | null = $state(null);
	let loading = $state(false);

	onMount(() => {
		if (address) {
			fetchENS();
		}
	});

	async function fetchENS() {
		if (!address) {
			return;
		}
		loading = true;
		ensName = null;
		try {
			ensName = await publicClient.getEnsName({ address });
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

<span {...restProps}>
	{#if loading}
		<span class="spinner" aria-label="Loading ENS name..."></span>
	{:else if ensName}
		{ensName}
	{:else}
		{formatAddress(address)}
	{/if}
</span>

<style>
	.spinner {
		display: inline-block;
		width: 1em;
		height: 1em;
		border: 2px solid #ccc;
		border-top: 2px solid #333;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		vertical-align: middle;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
