<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from '../$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<!-- +page.svelte is `@render`ed here -->
{@render children()}
