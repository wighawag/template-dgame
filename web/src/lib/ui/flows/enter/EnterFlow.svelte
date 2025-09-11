<script lang="ts">
	import { connection } from '$lib/connection/index.js';
	import { avatars } from '$lib/onchain/avatars.js';
	import Button from '$lib/ui/generic/Button.svelte';
	import Modal from '$lib/ui/modal/Modal.svelte';
	import { purchaseFlow } from '../purchase/purchaseFlow.js';
	import { enterFlow } from './enterFlow.js';
</script>

<Modal openWhen={$enterFlow.step === 'Loading'} onCancel={() => enterFlow.cancel()}>
	Please wait...
</Modal>
<Modal openWhen={$enterFlow.step === 'RequireSignIn'} onCancel={() => enterFlow.cancel()}>
	{#snippet title()}
		You need to sign-in first
	{/snippet}
	<Button onclick={() => connection.connect()}>sign-in</Button>
</Modal>
<Modal openWhen={$enterFlow.step === 'RequireAvatars'} onCancel={() => enterFlow.cancel()}>
	{#snippet title()}
		You do not have any avatar
	{/snippet}
	<Button onclick={() => purchaseFlow.start()}>Purchase</Button>
</Modal>
<Modal openWhen={$enterFlow.step === 'RequireDeposit'} onCancel={() => enterFlow.cancel()}>
	{#snippet title()}
		Your avatars are in your wallet, you need to deposit them first
	{/snippet}
	<Button onclick={() => console.log('TODO')}>Deposit</Button>
</Modal>
<Modal openWhen={$enterFlow.step === 'Ready'} onCancel={() => enterFlow.cancel()}>
	{#snippet title()}
		Select the avatar you want to play with
	{/snippet}
	{#if $enterFlow.step === 'Ready'}
		<div>
			{#each $enterFlow.avatars as avatarID}
				<Button onclick={() => enterFlow.enter(avatarID)}>{avatarID & 0xfffffffffn}</Button>
			{/each}
		</div>
	{/if}
</Modal>

{#if $connection.step !== 'SignedIn'}
	<div
		class="fixed bottom-0 left-0 z-50 flex h-12 w-full items-center justify-between bg-yellow-400 px-4 text-black shadow-md"
	>
		<span>To play <Button onclick={() => connection.connect()}>sign-in</Button></span>
	</div>
{:else if $avatars.step == 'Loaded' && $avatars.avatarsInGame.length == 0}
	<div
		class="fixed bottom-0 left-0 z-50 flex h-12 w-full items-center justify-between bg-yellow-400 px-4 text-black shadow-md"
	>
		<span>Choose an entry point you want to start in</span>
	</div>
{/if}
