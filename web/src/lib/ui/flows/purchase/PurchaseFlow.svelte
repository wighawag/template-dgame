<script lang="ts">
	import { connection } from '$lib/core/connection/index.js';
	import Button from '$lib/core/ui/ethereum/generic/Button.svelte';
	import Modal from '$lib/core/ui/modal/Modal.svelte';
	import { purchaseFlow } from './purchaseFlow.js';
</script>

<!-- TODO? not a modal -->
<Modal openWhen={$purchaseFlow.step == 'RequireSignIn'} onCancel={() => purchaseFlow.cancel()}>
	{#snippet title()}
		You need to sign-in first
	{/snippet}
	<Button onclick={() => connection.connect()}>sign-in</Button>
</Modal>

<Modal openWhen={$purchaseFlow.step == 'Ready'} onCancel={() => purchaseFlow.cancel()}>
	{#snippet title()}
		Avatar is $X.XX
	{/snippet}
	<Button onclick={() => purchaseFlow.purchase()}>buy</Button>
</Modal>

<Modal openWhen={$purchaseFlow.step == 'ConfirmTransaction'}>
	{#snippet title()}
		Please confirm your purchase
	{/snippet}
</Modal>

<Modal openWhen={$purchaseFlow.step == 'PendingTransaction'}>
	{#snippet title()}
		Please wait while the purchase go through
	{/snippet}
</Modal>
