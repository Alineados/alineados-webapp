<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		text,
		iconSnnipet
	}: {
		text: string;
		iconSnnipet: Snippet;
	} = $props();
</script>


<div class="flex flex-row gap-3 items-center">
    {@render iconSnnipet()}

    <p class="font-semibold text-alineados-gray-900 text-xl">
        {text}
    </p>
</div>