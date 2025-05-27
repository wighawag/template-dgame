<script lang="ts">
	import { Button } from 'bits-ui';
	let { children, ...restProps }: Button.RootProps = $props();
</script>

<Button.Root {...restProps}>
	{@render children?.()}
</Button.Root>
