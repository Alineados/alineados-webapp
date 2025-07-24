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
		currentStep = -1
	} = $props();

	let error = $state(false);

	// Calcular si esta celda está habilitada
	const isEnabled = $derived(currentActiveRow === rowIndex || currentActiveRow === -1);
	const isReferenceValueEnabled = $derived(isEnabled && currentStep === 0);
	const isRankingEnabled = $derived(isEnabled && currentStep === 1);
	
	// Calcular si los inputs están completos para permitir edición
	const isReferenceValueComplete = $derived(reference_value && reference_value !== '');
	const isRankingComplete = $derived(value && value !== '' && value !== '0');
	
	// Permitir edición si está habilitado O si ya está completo O si todas las filas están completas
	const canEditReferenceValue = $derived(isReferenceValueEnabled || isReferenceValueComplete || currentActiveRow === -1);
	const canEditRanking = $derived(isRankingEnabled || isRankingComplete || currentActiveRow === -1);

	function handleReferenceValueFocus() {
		// No necesitamos limpiar nada ahora que reference_value inicia vacío
	}

	function handleRankingFocus() {
		// Limpiar '0' si es el valor inicial
		if (value === '0') {
			value = '';
		}
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
		class="absolute left-1 top-1 w-[90px] truncate border-none bg-transparent text-left text-sm font-normal {color} outline-none"
		bind:value={reference_value}
		placeholder="U.M"
		disabled={!canEditReferenceValue}
		onfocus={handleReferenceValueFocus}
	/>
	<div class="flex h-full w-full items-center justify-center">
		<input
			oninput={handleOnInput}
			class="w-full border-none bg-transparent text-center text-3xl font-medium {error
				? 'text-red-500'
				: 'text-alineados-blue-500'} outline-none"
			bind:value
			disabled={!canEditRanking}
			onfocus={handleRankingFocus}
		/>
	</div>
</div>
