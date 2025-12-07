<script lang="ts">
	import Notifications from '$lib/notifications/Notifications.svelte';
	import VersionAndInstallNotfications from '$lib/service-worker/VersionAndInstallNotfications.svelte';
	import SplashScreen from '$lib/ui/loading/SplashScreen.svelte';
	import Warning from '$lib/ui/modal/Warning.svelte';
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}

<Warning />

<Notifications />

<VersionAndInstallNotfications src="" alt="" />

<SplashScreen />
