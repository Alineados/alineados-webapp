<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/shared/ui/sonner';

	let { children } = $props();
</script>

<Toaster />
{@render children?.()}
