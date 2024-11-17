<script lang="ts">
	export let items: string[] = [];
	export let selected: string | null = null;

	function selectItem(item: string) {
		selected = item;
	}
</script>

<div class="flex flex-wrap gap-[9px]">
	{#each items as item}
		<button
			class={`inline-flex items-center rounded-full border px-4 py-2 transition-transform duration-300 ease-in-out hover:scale-105 hover:border-[#E8A205] hover:bg-[#E8A205] hover:text-[#F7F7F7] ${
				selected === item
					? 'border-[#E8A205] bg-[#E8A205] text-[#F7F7F7]'
					: 'border-[#E1E1E1] text-alineados-gray-800'
			}`}
			on:click={() => selectItem(item)}
		>
			<span class="text-base font-medium">{item}</span>
		</button>
	{/each}
</div>
