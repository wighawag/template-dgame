<script lang="ts">
	import { connection, switchChainInfo } from './index';

	import Modal from '$lib/ui/modal/Modal.svelte';
	import BasicModal from '$lib/ui/modal/BasicModal.svelte';
	import Button from '$lib/ui/base/Button.svelte';

	let email: string = '';
	let emailInput: HTMLInputElement;
</script>

<Modal
	openWhen={$connection.step == 'WaitingForWalletConnection'}
	onCancel={() => connection.back('Idle')}
>
	{#snippet title()}
		Waiting for Wallet Connection...
	{/snippet}
	Please Accept Connection Request...
</Modal>

<Modal
	openWhen={$connection.step == 'ChooseWalletAccount'}
	onCancel={() => connection.back('Idle')}
>
	{#snippet title()}
		Choose Wallet Account
	{/snippet}
	{#if $connection.step == 'ChooseWalletAccount'}
		<!-- ASSERT ChooseWalletAccount -->
		{#each $connection.wallet.accounts as account}
			<Button onclick={() => connection.connectToAddress(account)}>{account}</Button>
		{/each}
	{/if}
</Modal>

<Modal
	openWhen={$connection.step == 'WalletToChoose' || $connection.step == 'MechanismToChoose'}
	onCancel={() => connection.cancel()}
	elementToFocus={emailInput}
>
	{#snippet title()}
		Choose Connection Type...
	{/snippet}

	<!-- Email option first -->
	<div class="mb-6 flex flex-col gap-2">
		<input
			bind:this={emailInput}
			bind:value={email}
			placeholder="Enter your email"
			class="w-full rounded-md border border-zinc-700 bg-zinc-800 p-2 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
		/>
		<Button
			class="rounded bg-zinc-700 px-4 py-2 text-zinc-100 transition hover:bg-zinc-600"
			onclick={() =>
				connection.connect({
					type: 'email',
					mode: 'otp',
					email
				})}
		>
			Sign in with Email
		</Button>
	</div>

	<!-- Wallet options -->
	{#if $connection.wallets.length > 0}
		<div class="mb-6 flex flex-col gap-2">
			{#each $connection.wallets as wallet}
				<Button
					class="rounded bg-zinc-700 px-4 py-2 text-zinc-100 transition hover:bg-zinc-600"
					onclick={() =>
						connection.connect({
							type: 'wallet',
							name: wallet.info.name
						})}
				>
					<img
						src={wallet.info.icon}
						alt={wallet.info.name}
						class="ml-2 mr-2 inline-block h-5 w-5"
					/>
					{wallet.info.name}
				</Button>
			{/each}
		</div>
	{/if}

	<!-- Dev option -->
	<Button
		class="rounded bg-zinc-700 px-4 py-2 text-zinc-100 transition hover:bg-zinc-600"
		onclick={() =>
			connection.connect({
				type: 'mnemonic',
				mnemonic: 'test test test test test test test test test test test junk',
				index: undefined
			})}
	>
		Dev
	</Button>
</Modal>
<!--
<Modal openWhen={$connection.step == 'WalletToChoose'} onCancel={() => connection.back('Idle')}>
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
					<img src={wallet.info.icon} alt={wallet.info.name} /><Button
						onclick={() => connection.connect({ type: 'wallet', name: wallet.info.name })}
						>{wallet.info.name}</Button
					>
				</div>
			</div>
		{/each}
	{/if}
</Modal> -->

<!-- TODO? not a modal -->
<Modal openWhen={$connection.step === 'WalletConnected'} onCancel={() => connection.cancel()}>
	{#snippet title()}
		Wallet Connected
	{/snippet}
	<Button onclick={() => connection.requestSignature()}>sign-in</Button>
</Modal>

<Modal openWhen={$connection.step === 'ChooseWalletAccount'} onCancel={() => connection.cancel()}>
	{#snippet title()}
		Choose Wallet Account
	{/snippet}
	{#if $connection.step == 'ChooseWalletAccount'}
		<!-- ASSERT ChooseWalletAccount -->
		{#each $connection.wallet.accounts as account}
			<Button onclick={() => connection.connectToAddress(account)}>{account}</Button>
		{/each}
	{/if}
	<!-- TODO : cancel Button -->
</Modal>

<BasicModal
	title="Please sign"
	openWhen={$connection.step === 'WaitingForSignature'}
	onCancel={() => connection.cancel()}
>
	<p>Please accept the signature request...</p>
</BasicModal>

<BasicModal title="Please wait..." openWhen={$connection.step === 'PopupLaunched'}>
	{#if $connection.step === 'PopupLaunched'}
		<!-- ASSERT PopupLaunched -->
		{#if $connection.popupClosed}
			<p>Popup seems to be closed without giving response.</p>
			<Button class="btn btn-primary" onclick={() => connection.cancel()}>abort</Button>
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
	openWhen={$connection.step == 'WalletConnected' && $connection.wallet?.invalidChainId}
	onCancel={() => connection.cancel()}
>
	<p>Switch to {switchChainInfo.chainName} to continue.</p>
</BasicModal>
