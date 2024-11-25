<script lang="ts">
	import ArrowDown from '$lib/icons/ArrowDown.svelte';
	import type { Snippet } from 'svelte';

	let {
		arrow
	}: {
		arrow: Snippet;
	} = $props();
</script>

<div class="flex items-start justify-center">
	<div class="flex items-start">
		{@render arrow()}
	</div>
	<p class="text-5xl font-semibold text-alineados-gray-800">55</p>
</div>
