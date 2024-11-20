<script lang="ts">
	let {
		text,
		selected = false
	}: {
		text: string;
		selected?: boolean;
	} = $props();

	function selectItem() {
		selected = !selected;
	}
</script>

<button
	class={`inline-flex items-center rounded-full border px-4 py-1 transition-transform duration-300 ease-in-out hover:border-[#57D95D] hover:bg-[#E7FAE8] hover:text-[#075F0B] ${
		selected
			? 'border-[#57D95D] bg-[#E7FAE8] text-[#075F0B]'
			: 'border-[#E1E1E1] text-alineados-gray-800'
	} transition-colors duration-300 ease-in-out`}
	onclick={selectItem}
>
	<span class="text-xs font-medium">{text}</span>
</button>
