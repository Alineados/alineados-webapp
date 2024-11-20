<script lang="ts">
	import * as Card from '$lib/shared/ui/card/index.js';
	import type { Snippet } from 'svelte';

	let {
		contentClass,
		leftContent,
		rightContent
	}: {
		contentClass: string;
		leftContent: Snippet;
		rightContent: Snippet;
	} = $props();
</script>

<!-- md:w-5/12 lg:w-3/12 -->
<Card.Root
	class={`h-4/12 w-full transform rounded-xl bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl md:w-[227px] `}
>
	<Card.Content class="flex p-0 {contentClass}">
		{@render leftContent()}
		{@render rightContent()}
	</Card.Content>
</Card.Root>
