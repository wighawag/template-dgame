<script>
	import { connection, chainInfo } from '$lib/connection';
	import { viemChainInfoToSwitchChainInfo } from '$lib/utils/ethereum/chains';

	import ImgBlockie from '$lib/utils/ethereum/ImgBlockie.svelte';
</script>

<div class="menu">
	<!-- TODO top panel -->

	{#if $connection.step === 'Idle'}
		{#if $connection.loading}
			loading...
		{:else}
			<button onclick={() => connection.connect()}>connect</button>
		{/if}
		<!-- {:else if $connection.step === 'WalletConnected'}
		<p>{$connection.step}</p> -->
	{:else if $connection.step === 'SignedIn'}
		you are signed-in: {$connection.account.address}

		<button onclick={() => connection.disconnect()}>disconnect</button>

		{#if $connection.wallet}
			{@const accountChanged = $connection.wallet.accountChanged}

			{#if accountChanged}
				<button
					style="margin-right: 2rem;"
					onclick={() => connection.connecToAddress(accountChanged)}>switch</button
				>
			{/if}

			{@const invalidChain = $connection.wallet?.invalidChainId}

			{#if invalidChain}
				<button
					style="margin-right: 2rem;"
					onclick={() =>
						connection.switchWalletChain(
							connection.provider.chainId,
							viemChainInfoToSwitchChainInfo(chainInfo)
						)}
					disabled={!!$connection.wallet?.switchingChain}>switch chain</button
				>
			{/if}

			{#if $connection.wallet.status == 'locked'}
				<button
					style="margin-right: 2rem;"
					disabled={$connection.wallet.unlocking}
					onclick={() => connection.unlock()}>unlock</button
				>
			{:else if $connection.wallet.status == 'disconnected'}
				<p style="color: oklch(0.637 0.237 25.331);">
					The account has been disconnected, reconnect it to continue. or disconnect
				</p>
			{/if}
		{/if}

		<ImgBlockie address={$connection.account.address} style="width: 24px; height: 24px;" />
	{/if}
</div>

<style>
	.menu {
		position: absolute;
		top: 0;
		left: 0;
		background-color: white;
	}
</style>
