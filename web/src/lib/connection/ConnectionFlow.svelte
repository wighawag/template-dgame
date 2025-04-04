<script lang="ts">
	import { connection } from './index';

	import Modal from '$lib/ui/modal/Modal.svelte';

	let email: string = '';
</script>

{#if $connection.step == 'WaitingForWalletConnection'}
	<Modal title="Wallet connection requested..."></Modal>
{:else if $connection.step === 'WalletConnected'}
	<Modal title="Wallet connected">
		<button onclick={() => connection.requestSignature()}>sign-in</button>
		<button onclick={() => connection.cancel()}>cancel</button>
	</Modal>
{:else if $connection.step == 'ChooseWalletAccount'}
	<Modal title="Choose your Account" oncancel={() => connection.back('WalletToChoose')}>
		{#each $connection.wallet.accounts as account}
			<button onclick={() => connection.connecToAddress(account)}>{account}</button>
		{/each}
	</Modal>
{:else if $connection.step === 'WaitingForSignature'}
	<Modal title="Please sign">
		<p>sign...</p>
	</Modal>
{:else if $connection.step === 'PopupLaunched'}
	<Modal title="Please wait...">
		<p>popup TODO</p>
	</Modal>
{:else if $connection.step === 'MechanismToChoose' || $connection.step === 'WalletToChoose'}
	<Modal title="Connect ">
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

		<input bind:value={email} />
		<button
			onclick={() =>
				connection.connect({
					type: 'email',

					mode: 'otp',

					email
				})}>email</button
		>
	</Modal>
{/if}
