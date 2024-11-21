<script lang="ts">
	import DownCross from '$lib/icons/DownCross.svelte';
	import RightCross from '$lib/icons/RightCross.svelte';

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
	class={`group inline-flex items-center rounded-3xl border px-3 py-2 transition-transform duration-300 ease-in-out hover:border-alineados-green-900 hover:bg-alineados-green-900 hover:text-alineados-gray-50 ${
		selected
			? 'border-alineados-green-900 bg-alineados-green-900 text-alineados-blue-50'
			: 'border-[#E1E1E1] text-alineados-gray-800'
	} transition-colors duration-300 ease-in-out`}
	onclick={selectItem}
>
	{#if type === 'complex'}
		<div class="flex flex-row items-center justify-center gap-2">
			<span class="text-base font-medium">{text}</span>
			{#if selected}
				<DownCross stroke="currentColor" />
			{:else}
				<RightCross stroke="currentColor" />
			{/if}
		</div>
	{:else}
		<span class="text-base font-medium">{text}</span>
	{/if}
</button>
