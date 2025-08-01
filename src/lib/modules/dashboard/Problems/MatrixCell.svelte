<script lang="ts">
	import type { CellMatrix } from '$lib/interfaces';

	let {
		color = 'alineados-blue-900',
		value = $bindable(),
		reference_value = $bindable(),
		cells = $bindable(),
		index,
		onInput,
		rowIndex = 0,
		currentActiveRow = -1,
		currentStep = -1,
		enabled = false
	} = $props();

	let error = $state(false);
	let isReferenceValueFocused = $state(false);
	let isRankingFocused = $state(false);

	// Calcular si esta celda está habilitada
	const isEnabled = $derived(enabled && (currentActiveRow === rowIndex || currentActiveRow === -1 || rowIndex < currentActiveRow));
	const isReferenceValueEnabled = $derived(isEnabled && currentStep === 0);
	const isRankingEnabled = $derived(isEnabled && currentStep === 1);
	
	// Calcular si los inputs están completos para permitir edición
	const isReferenceValueComplete = $derived(reference_value && reference_value !== '');
	const isRankingComplete = $derived(value && value !== '');
	
	// Permitir edición si está habilitado O si ya está completo O si todas las filas están completas
	const canEditReferenceValue = $derived(isReferenceValueEnabled || isReferenceValueComplete || (enabled && currentActiveRow === -1));
	const canEditRanking = $derived(isRankingEnabled || isRankingComplete || (enabled && currentActiveRow === -1));

	function handleReferenceValueFocus() {
		isReferenceValueFocused = true;
	}

	function handleReferenceValueBlur() {
		isReferenceValueFocused = false;
	}

	function handleRankingFocus() {
		isRankingFocused = true;
	}

	function handleRankingBlur() {
		isRankingFocused = false;
	}

	function handleOnInput() {

		if (value === '') {
			error = true;
			return;
		}

		value = value.trim();
		value = value.replace('0', '');

		let number = parseInt(value);

		if (isNaN(number)) {
			error = true;
			return;
		}

		// evaluate if the value already exists on cells
		if (cells.find((cell, i) => parseInt(cell.value) === number && i !== index)) {
			error = true;
			return;
		}
		else error = false;

		if (number <= 0 || number > 3) {
			error = true;
			return;
		} else {
			error = false;
			if (onInput) onInput();
		}
	}
</script>

<div
	class="relative flex size-[100px] flex-col items-center justify-center rounded-xl border {error
		? 'border-red-500 text-red-400 '
		: 'border-alineados-gray-100 text-alineados-blue-600 '} bg-alineados-gray-50 text-3xl font-medium {!isEnabled ? 'opacity-50 pointer-events-none' : ''}"
>
	<input
		class="absolute left-1 top-1 w-[90px] truncate bg-transparent text-left text-sm font-normal rounded-sm {color} outline-none {isReferenceValueEnabled && !reference_value ? 'border-2 border-orange-500 animate-border-cursor-blink' : 'border-none'}"
		bind:value={reference_value}
		placeholder={isReferenceValueFocused ? "" : "U.M"}
		disabled={!canEditReferenceValue}
		onfocus={handleReferenceValueFocus}
		onblur={handleReferenceValueBlur}
	/>
	<div class="flex h-full w-full items-center justify-center">
		<input
			oninput={handleOnInput}
			class="w-full bg-transparent text-center text-3xl rounded-sm font-medium {error
				? 'text-red-500'
				: 'text-alineados-blue-500'} outline-none {isRankingEnabled && !value ? 'border-2 border-orange-500 animate-border-cursor-blink' : 'border-none'}"
			bind:value
			placeholder={isRankingFocused ? "" : "0"}
			disabled={!canEditRanking}
			onfocus={handleRankingFocus}
			onblur={handleRankingBlur}
		/>
	</div>
</div>

<style>
	@keyframes border-cursor-blink {
		0%, 50% {
			border-color: rgb(249 115 22); /* orange-500 */
		}
		51%, 100% {
			border-color: transparent;
		}
	}

	.animate-border-cursor-blink {
		animation: border-cursor-blink 1.5s infinite;
	}
</style>
