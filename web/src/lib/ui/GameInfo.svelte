<script lang="ts">
	import { epochInfo } from '$lib/core/time/index.js';
	import Modal from '$lib/core/ui/modal/Modal.svelte';
	import { avatars } from '$lib/onchain/avatars';
	import { localState } from '$lib/private/localState';
	import { viewState, type AvatarViewEntity } from '$lib/view';

	function clear() {
		avatars.update();
		localState.markTutorialAsUnSeen();
		localState.removeAvatar();
	}

	let avatar = $derived(
		$viewState.avatar ? ($viewState.entities[$viewState.avatar.id] as AvatarViewEntity) : undefined
	);
</script>

<Modal
	openWhen={avatar ? avatar.life == 0 && $epochInfo.currentEpoch >= avatar.lastEpoch + 1 : false}
>
	{#snippet title()}
		Your avatar died
	{/snippet}
	<div>
		<button onclick={() => clear()}>ok</button>
	</div>
</Modal>
