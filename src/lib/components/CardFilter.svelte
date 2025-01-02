<script lang="ts">
	import ChevronDown from '$lib/icons/ChevronDown.svelte';
	import ChevronRight from '$lib/icons/ChevronRight.svelte';

	let {
		text,
		type,
		selected = $bindable(),
		triggerFunction
	}: {
		text: string;
		type: 'simple' | 'complex';
		selected?: boolean;
		triggerFunction?: () => void;
	} = $props();

	function selectItem() {
		selected = !selected;
		triggerFunction && triggerFunction();
	}
</script>

<button
	class={`group inline-flex items-center rounded-3xl border px-2 py-1 transition-transform duration-300 ease-in-out hover:border-alineados-green-900 hover:bg-alineados-green-900 hover:text-white ${
		selected
			? 'border-alineados-green-900 bg-alineados-green-900 text-alineados-gray-50'
			: 'border-alineados-blue-100 text-alineados-gray-800'
	} transition-colors duration-300 ease-in-out`}
	onclick={selectItem}
>
	{#if type === 'complex'}
		<div class="flex flex-row items-center justify-center gap-2">
			<span class="text-sm font-medium">{text}</span>
			{#if selected}
				<ChevronDown
					styleTw={`size-4 group-hover:text-white ${
						selected ? 'text-alineados-gray-50' : 'text-alineados-gray-800'
					}`}
				/>
			{:else}
				<ChevronRight
					styleTw={`size-4 group-hover:text-white ${
						selected ? 'text-alineados-gray-50' : 'text-alineados-gray-800'
					}`}
				/>
			{/if}
		</div>
	{:else}
		<span class="text-base font-medium">{text}</span>
	{/if}
</button>
