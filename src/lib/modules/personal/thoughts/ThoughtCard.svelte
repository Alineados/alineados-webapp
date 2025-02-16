<script lang="ts">
	import type { Thought } from '$lib/interfaces';

	let { thought }: { thought: Thought } = $props();

	let highlighted = $state(false);

	function toggleHighlight() {
		highlighted = !highlighted;
	}
</script>

<div
	class={`relative w-full rounded-lg border p-4 ${
		highlighted
			? 'border-alineados-green-900 bg-alineados-green-50'
			: 'border-alineados-gray-200 bg-alineados-gray-50'
	}`}
>
	<button
		class={`absolute right-0 top-0 cursor-pointer p-2 text-2xl leading-none transition-colors duration-300 ${
			highlighted ? 'text-[#00a000]' : 'text-alineados-gray-300'
		} hover:text-[#00a000]`}
		onclick={toggleHighlight}
	>
		{#if highlighted}
			★
		{:else}
			☆
		{/if}
	</button>
	<div class="pr-8">
		<p
			class="line-clamp-2 text-xl font-bold tracking-tight text-gray-900 group-hover:text-gray-600"
		>
			{thought.thought_name}
		</p>
	</div>
</div>
