<script>
	import { connection, chainInfo } from '$lib/connection';
	import { viemChainInfoToSwitchChainInfo } from '$lib/utils/ethereum/chains';

	import ImgBlockie from '$lib/utils/ethereum/ImgBlockie.svelte';
</script>

<div class="absolute top-0 left-0 bg-white text-black">
	<!-- TODO top panel -->

	{#if $connection.step === 'Idle' && $connection.loading}
		loading...
	{:else if $connection.step === 'SignedIn'}
		you are signed-in: {$connection.account.address}

		<button onclick={() => connection.disconnect()}>disconnect</button>

		{#if $connection.wallet}
			{@const accountChanged = $connection.wallet.accountChanged}

			{#if accountChanged}
				<button
					style="margin-right: 2rem;"
					onclick={() => connection.connectToAddress(accountChanged)}>switch</button
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
	{:else}
		<!-- if we use disblaed here, the modal would not be able to bring focus back to the button
         Since modal prevent interaction, we can keep the button enabled
         But ideally if we could solve it in a better way that would be better -->
		<!--  disabled={$connection.step != 'Idle'} -->
		<!-- alternative: delay the disabled state-->
		<!-- you can do with the following -->
		<!-- import { tick } from 'svelte';

           let disabled = $state(false);
           $effect(() => {
               if ($connection.step) {
                   tick().then(() => {
                       disabled = $connection.step != 'Idle';
                   });
               }
           }); -->
		<button onclick={() => connection.connect()}>connect</button>
	{/if}
</div>
