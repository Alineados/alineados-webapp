<script lang="ts">
	let {
		text,
		selected = $bindable(),
		triggerFunction
	}: {
		text: string;
		selected?: boolean;
		triggerFunction?: () => void;
	} = $props();

	function selectItem() {
		selected = !selected;
		triggerFunction && triggerFunction();
	}
</script>

<button
	class={`inline-flex items-center rounded-full border px-5 py-2 transition-transform duration-300 ease-in-out hover:border-[#0FC917] hover:bg-[#0FC917] hover:text-[#F7F7F7] ${
		selected
			? 'border-[#0FC917] bg-[#0FC917] text-[#F7F7F7]'
			: 'border-[#E1E1E1] text-alineados-gray-800'
	} transition-colors duration-300 ease-in-out`}
	onclick={selectItem}
>
	<span class="text-base font-medium">{text}</span>
</button>
