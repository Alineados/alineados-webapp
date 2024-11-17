<script lang="ts">
	import * as Card from '$lib/shared/ui/card/index.js';
	import type { Snippet } from 'svelte';

	let {
		state = 'default',
		headerClass,
		header,
		content,
		footer
	}: {
		state: 'default' | 'stable' | 'warning' | 'danger';
		headerClass: string;
		header: Snippet;
		content: Snippet;
		footer: Snippet;
	} = $props();
</script>

<Card.Root
	class={`h-4/6 w-1/5 transform rounded-xl bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
		state === 'stable'
			? 'border-blue-500'
			: state === 'warning'
				? 'border-yellow-500'
				: state === 'danger'
					? 'border-red-500'
					: ''
	}`}
>
	<Card.Header class="flex flex-row p-0 {headerClass}">
		<!-- <slot name="header"></slot> -->
		{@render header()}
	</Card.Header>
	<Card.Content class="p-0">
		<!-- <slot name="content"></slot> -->
		{@render content()}
	</Card.Content>
	<Card.Footer class="flex justify-end p-0">
		<!-- <slot name="footer"></slot> -->
		{@render footer()}
	</Card.Footer>
</Card.Root>
