<script lang="ts">
	let {
		color = 'alineados-blue-900',
		value = $bindable(),
		reference_value = $bindable(),
		onInput
	}: {
		color?: string;
		value: string;
		reference_value: string;
		onInput?: () => void;
	} = $props();

	let error = $state(false);

	function handleOnInput() {
		let number = parseInt(value);
		if (number < 0 || number > 3) error = true;
		else {
			error = false;
			if (onInput) onInput();
		}
	}
</script>

<div
	class="relative flex size-[100px] flex-col items-center justify-center rounded-xl border {error
		? 'border-red-500 text-red-400 '
		: 'border-alineados-gray-100 text-alineados-blue-600 '} bg-alineados-gray-50 text-3xl font-medium"
>
	<input
		class="absolute left-1 top-1 w-auto border-none bg-transparent text-left text-sm font-normal {color} outline-none"
		bind:value={reference_value}
	/>
	<div class="flex h-full w-full items-center justify-center">
		<input
			oninput={handleOnInput}
			class="w-full border-none bg-transparent text-center text-3xl font-medium {error
				? 'text-red-500'
				: 'text-alineados-blue-500'} outline-none"
			bind:value
		/>
	</div>
</div>
