<script lang="ts">
	import { connection, switchChainInfo } from './index';

	import Modal from '$lib/ui/modal/Modal.svelte';
	import BasicModal from '$lib/ui/modal/BasicModal.svelte';

	let email: string = '';
</script>

<Modal
	openOn={$connection.step == 'WaitingForWalletConnection'}
	onCancel={() => connection.back('Idle')}
>
	{#snippet title()}
		Waiting for Wallet Connection...
	{/snippet}
	Please Accept Connection Request...
</Modal>

<Modal openOn={$connection.step == 'ChooseWalletAccount'} onCancel={() => connection.back('Idle')}>
	{#snippet title()}
		Choose Wallet Account
	{/snippet}
	{#if $connection.step == 'ChooseWalletAccount'}
		<!-- ASSERT ChooseWalletAccount -->
		{#each $connection.wallet.accounts as account}
			<button onclick={() => connection.connectToAddress(account)}>{account}</button>
		{/each}
	{/if}
</Modal>

<Modal
	openOn={$connection.step == 'WalletToChoose' || $connection.step == 'MechanismToChoose'}
	onCancel={() => connection.cancel()}
>
	{#snippet title()}
		Choose Connection Type...
	{/snippet}
	{#if $connection.wallets.length > 0}
		{#each $connection.wallets as wallet}
			<button
				onclick={() =>
					connection.connect({
						type: 'wallet',

						name: wallet.info.name
					})}>{wallet.info.name}</button
			>
		{/each}
	{/if}

	<button
		onclick={() =>
			connection.connect({
				type: 'mnemonic',

				mnemonic: 'test test test test test test test test test test test junk',

				index: undefined
			})}>dev</button
	>

	<input id="ConnectionFlow_email" bind:value={email} />
	<button
		onclick={() =>
			connection.connect({
				type: 'email',

				mode: 'otp',

				email
			})}>email</button
	>
</Modal>
<!--
<Modal openOn={$connection.step == 'WalletToChoose'} onCancel={() => connection.back('Idle')}>
	{#if $connection.wallets.length == 0}
		No wallet found. Download <a
			href="https://metamask.io/download/"
			target="_blank"
			rel="noopener noreferrer">MetaMask</a
		>
		<br />
	{:else}
		<h2 class="text-xl">Choose your Wallet</h2>
		{#each $connection.wallets as wallet}
			<div class="flex flex-col">
				<div class="flex flex-row gap-2">
					<img src={wallet.info.icon} alt={wallet.info.name} /><button
						onclick={() => connection.connect({ type: 'wallet', name: wallet.info.name })}
						>{wallet.info.name}</button
					>
				</div>
			</div>
		{/each}
	{/if}
</Modal> -->

<!-- TODO? not a modal -->
<Modal openOn={$connection.step === 'WalletConnected'} onCancel={() => connection.cancel()}>
	{#snippet title()}
		'Wallet Connected'
	{/snippet}
	<button onclick={() => connection.requestSignature()}>sign-in</button>
</Modal>

<Modal openOn={$connection.step === 'ChooseWalletAccount'} onCancel={() => connection.cancel()}>
	{#snippet title()}
		'Choose Wallet Account'
	{/snippet}
	{#if $connection.step == 'ChooseWalletAccount'}
		<!-- ASSERT ChooseWalletAccount -->
		{#each $connection.wallet.accounts as account}
			<button onclick={() => connection.connectToAddress(account)}>{account}</button>
		{/each}
	{/if}
	<!-- TODO : cancel button -->
</Modal>

<BasicModal
	title="Please sign"
	openOn={$connection.step === 'WaitingForSignature'}
	onCancel={() => connection.cancel()}
>
	<p>sign...</p>
</BasicModal>

<BasicModal title="Please wait..." openOn={$connection.step === 'PopupLaunched'}>
	{#if $connection.step === 'PopupLaunched'}
		<!-- ASSERT PopupLaunched -->
		{#if $connection.popupClosed}
			<p>Popup seems to be closed without giving response.</p>
			<button class="btn btn-primary" onclick={() => connection.cancel()}>abort</button>
		{:else}
			<p>please follow instruction...</p>
		{/if}
	{/if}
</BasicModal>

<!-- TODO not a Modal -->
<BasicModal
	title={`Require Connection to ${switchChainInfo.chainName}`}
	cancel={true}
	confirm={{
		label: 'Switch',
		onclick: () => connection.switchWalletChain(connection.provider.chainId, switchChainInfo),
		disabled: !!$connection.wallet?.switchingChain
	}}
	openOn={$connection.step == 'WalletConnected' && $connection.wallet?.invalidChainId}
	onCancel={() => connection.cancel()}
>
	<p>Switch to {switchChainInfo.chainName} to continue.</p>
</BasicModal>
