<script lang="ts">
	export let text: string;
	export let selected: boolean = false;

	function selectItem() {
		selected = !selected;
	}
</script>

<button
	class={`inline-flex items-center rounded-full border px-5 py-2 transition-transform duration-300 ease-in-out hover:border-[#0FC917] hover:bg-[#0FC917] hover:text-[#F7F7F7] ${
		selected
			? 'border-[#0FC917] bg-[#0FC917] text-[#F7F7F7]'
			: 'border-[#E1E1E1] text-alineados-gray-800'
	} transition-colors duration-300 ease-in-out`}
	on:click={selectItem}
>
	<span class="text-base font-medium">{text}</span>
</button>
