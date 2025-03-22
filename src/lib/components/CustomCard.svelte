<script lang="ts">
	import * as Card from '$lib/shared/ui/card/index.js';
	import type { Snippet } from 'svelte';

	let {
		state = 'default',
		headerClass,
		isNew = false,
		padding = 'p-0',
		header,
		content,
		footer,
		onClickCard
	}: {
		state?: 'default' | 'stable' | 'warning' | 'danger' | 'completed' | 'important';
		headerClass: string;
		isNew?: boolean;
		padding?: string;
		header: Snippet;
		content: Snippet;
		footer: Snippet;
		onClickCard: (e:any) => void;
	} = $props();
</script>

<!-- md:w-5/12 lg:w-3/12 -->
<Card.Root
	onclick={onClickCard}
	class={`h-4/12 w-full transform rounded-xl bg-gradient-to-br from-white to-gray-50 ${padding}  ${isNew ? 'opacity-50' : ''} shadow-lg transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-xl md:w-[227px] ${
		state === 'stable'
			? 'border-alineados-blue-900'
			: state === 'warning'
				? 'border-yellow-500'
				: state === 'danger'
					? 'border-red-500'
					: state === 'completed'
						? 'border-blue-900'
						// :  state === 'important'
						// 	? 'border-alineados-green-600 shadow-alineados-green-100'
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
	<Card.Footer class="flex justify-between p-0">
		<!-- <slot name="footer"></slot> -->
		{@render footer()}
	</Card.Footer>
</Card.Root>
