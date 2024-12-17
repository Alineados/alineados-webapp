<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		arrow,
		value
	}: {
		arrow: Snippet;
		value: number;
	} = $props();
</script>

<div class="flex items-start justify-center gap-x-1">
	<div class="flex items-start">
		{@render arrow()}
	</div>
	<p class="text-4xl font-semibold text-alineados-gray-800">{value}</p>
</div>
