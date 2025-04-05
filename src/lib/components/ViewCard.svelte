<script lang="ts">
	import * as Card from '$lib/shared/ui/card/index.js';
	import type { Snippet } from 'svelte';

	let {
		contentClass,
		content
	}: {
		contentClass?: string;
		content: Snippet;
	} = $props();
</script>

<Card.Root
	class="flex h-auto w-full transform items-center rounded-md bg-gradient-to-br border-alineados-orange-900  from-white to-gray-50 p-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
>
	<Card.Content class="flex p-0 {contentClass}">
		{@render content()}
	</Card.Content>
</Card.Root>
