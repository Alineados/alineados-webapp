<script lang="ts">
	let {
		text = $bindable(),
		selected = false,
		isDisabled = false,
		changeFinalDecision
	}: {
		text: string;
		selected?: boolean;
		isDisabled?: boolean;
		changeFinalDecision?: () => void;
	} = $props();

	function selectItem() {
		selected = !selected;
		changeFinalDecision && changeFinalDecision();
	}
</script>

<button
	class={`inline-flex items-center rounded-xl border px-4 py-2 transition-transform duration-300 ease-in-out hover:border-alineados-green-900 hover:bg-alineados-green-50 hover:text-alineados-green-900 ${
		selected
			? 'border-alineados-green-900 bg-alineados-green-50 text-alineados-green-900'
			: 'border-alineados-gray-200  text-alineados-gray-600'
	} transition-colors duration-300 ease-in-out`}
	onclick={selectItem}
	disabled={isDisabled}
>
	<span class="text-sm font-medium">{text}</span>
</button>
