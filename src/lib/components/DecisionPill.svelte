<script lang="ts">
	let {
		text = $bindable(),
		selected = false,
		isDisabled = $bindable(),
		index = 0,
		changeSelected
	}: {
		text: string;
		selected?: boolean;
		isDisabled?: boolean;
		index?: number;
		changeSelected?: () => void;
	} = $props();

	function selectItem() {
		if (!isDisabled && !selected) { // Only allow selection when not disabled
			selected = true;
			changeSelected && changeSelected();
		}
	}
</script>

<button
	class={`inline-flex items-center rounded-xl border px-4 py-2 transition-transform duration-300 ease-in-out  
	
	${
		isDisabled 
		?'cursor-not-allowed'
		: 'hover:border-alineados-green-900 hover:bg-alineados-green-50 hover:text-alineados-green-900'
	}

	${	
		selected
			? 'border-alineados-green-900 bg-alineados-green-50 text-alineados-green-900'
			: 'border-alineados-gray-200  text-alineados-gray-600'
	} transition-colors duration-300 ease-in-out`}
	onclick={selectItem}
	class:ml-10={index === 0}
	disabled={isDisabled}
>
	<span class="text-sm font-medium">{index !== 0 ? `Alternativa ${index} - ` : ''} {text}</span>
</button>
