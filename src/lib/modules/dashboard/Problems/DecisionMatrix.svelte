<script lang="ts">
	import StarSolid from '$lib/icons/StarSolid.svelte';
	import { matrix } from '$lib/stores';
	import { onMount } from 'svelte';
	import MatrixCell from './MatrixCell.svelte';
	import RowMatrix from './RowMatrix.svelte';
	import { wrap } from 'comlink';
	import { writable } from 'svelte/store';

	let colors = [
		'text-alineados-green-900',
		'text-alineados-orange-900',
		'text-cyan-900',
		'text-red-500',
		'text-yellow-500'
	];
	let worker: any;
	let api: any;
	// Estado para el tooltip personalizado
	let tooltipText = '';
	let tooltipVisible = false;
	let tooltipPosition = { x: 0, y: 0 };

	// Estado para el cuadro informativo
	let showRankingInfo = true;

	function setColor(i: number): string {
		return colors[i];
	}

	function showTooltip(event: MouseEvent, text: string) {
		tooltipText = text;
		tooltipPosition = { x: event.clientX, y: event.clientY };
		tooltipVisible = true;
	}

	function hideTooltip() {
		tooltipVisible = false;
	}

	function closeRankingInfo() {
		showRankingInfo = false;
	}

	onMount(() => {
		// load worker
		if (window.Worker) {
			worker = new Worker(new URL('$lib/workers/matrix.ts', import.meta.url), { type: 'module' });
			api = wrap(worker);
		}
	});


	$: gridColumns = `250px 50px ${$matrix.cols.map(() => '100px').join(' ')}`;
	$: allPrioritiesSet = $matrix.rows.every(row => row.key && row.key !== '');
	$: allUnitsSet = $matrix.rows.every(row => row.units && row.units !== '');

	// Calcular fila activa y paso actual
	$: currentActiveRow = (() => {
		if (!allUnitsSet) return -1; // Ninguna fila activa si no están todas las unidades llenas
		
		for (let i = 0; i < $matrix.rows.length; i++) {
			const row = $matrix.rows[i];
			// Verificar si la fila tiene todas las reference_value llenas
			const allReferenceValuesFilled = row.cells.every(cell => cell.reference_value && cell.reference_value !== '');
			// Verificar si la fila tiene todos los rankings llenos y válidos
			const allRankingsValid = (() => {
				const values = row.cells.map(cell => cell.value).filter(v => v && v !== '');
				if (values.length !== row.cells.length) return false;
				const nums = values.map(v => parseInt(v));
				if (nums.some(n => isNaN(n) || n < 1 || n > 3)) return false;
				return new Set(nums).size === nums.length;
			})();
			
			// Si no tiene reference_value llenos, esta es la fila activa en paso "unidad de medida"
			if (!allReferenceValuesFilled) return i;
			// Si tiene reference_value pero no rankings válidos, esta es la fila activa en paso "ranqueo"
			if (!allRankingsValid) return i;
			// Si tiene todo, pasar a la siguiente fila
		}
		return -1; // Todas las filas completas - pero permitir edición
	})();

	// Calcular paso actual (0 = unidad de medida, 1 = ranqueo)
	$: currentStep = (() => {
		if (currentActiveRow === -1) return -1;
		const row = $matrix.rows[currentActiveRow];
		const allReferenceValuesFilled = row.cells.every(cell => cell.reference_value && cell.reference_value !== '');
		return allReferenceValuesFilled ? 1 : 0; // 0 = unidad de medida, 1 = ranqueo
	})();

	// Calcular si MatrixCell debe estar habilitado (solo cuando todas las unidades están llenas)
	$: matrixCellEnabled = allUnitsSet;
</script>

<div class="relative">
	<div class="grid gap-4 p-4 " style="grid-template-columns: {gridColumns}">
	<!-- Header Row -->
	<div></div>
	<div></div>

	{#each $matrix.cols as column, index}
		<div 
			class="text-center text-xs font-medium w-[100px] break-words cursor-help" 
			onmouseenter={(e) => showTooltip(e, column.name)}
			onmouseleave={hideTooltip}
		>
			{(() => {
				const words = column.name.split(' ');
				
				// Si hay más de 5 palabras, cortar en la 5ta palabra
				if (words.length > 5) {
					return words.slice(0, 5).join(' ') + '...';
				}
				
				// Si el texto completo es muy largo (>20 caracteres), cortar por caracteres
				// if (column.name.length > 20) {
				// 	return column.name.substring(0, 20) + '...';
				// }
				
				// Si hay palabras individuales muy largas (>15 caracteres), cortar la primera palabra larga
				const longWordIndex = words.findIndex(word => word.length > 15);
				if (longWordIndex !== -1) {
					const beforeLongWord = words.slice(0, longWordIndex).join(' ');
					const longWord = words[longWordIndex].substring(0, 15);
					return (beforeLongWord + ' ' + longWord).trim() + '...';
				}
				
				// Si no hay problemas, mostrar completo
				return column.name;
			})()}
		</div>
	{/each}

	<!-- Subheader Row -->
	<div class="-mb-3"></div>
	<div class="-mb-3"></div>
	{#each $matrix.cols as col, i}
		{#if i === 0}
			<div class="-mb-3">
				<span class="text-xs font-medium text-alineados-gray-300">Alternativas &rarr;</span>
			</div>
		{:else}
			<div class="-mb-3"></div>
		{/if}
	{/each}

	<!-- Rows -->
	{#each $matrix.rows as row, i}
		<RowMatrix
			onChange={async () => {
				$matrix = await api.calculateResults($matrix);
				$matrix = $matrix;
			}}
			bind:name={$matrix.rows[i].name}
			bind:units={$matrix.rows[i].units}
			bind:key={$matrix.rows[i].key}
			bind:percentage={$matrix.rows[i].percentage}
			color={setColor(i)}
			allPrioritiesSet={allPrioritiesSet}
		/>

		{#if i === 0}
			<div class="relative -mr-3 flex justify-end overflow-hidden">
				<span
					class="absolute origin-top-left translate-y-full -rotate-90 transform whitespace-nowrap text-xs font-medium tracking-wider text-alineados-gray-300"
					style="left: 50%; bottom: 0.5rem;"
				>
					&larr; Objetivos
				</span>
			</div>
		{:else}
			<div></div>
		{/if}
		{#each row.cells as _, j}
			<MatrixCell
				onInput={async () => {
					$matrix = await api.calculateResults($matrix);
					$matrix = $matrix;
				}}
				color={setColor(i)}
				index={j}
				bind:cells={$matrix.rows[i].cells}
				bind:reference_value={$matrix.rows[i].cells[j].reference_value}
				bind:value={$matrix.rows[i].cells[j].value}
				rowIndex={i}
				currentActiveRow={currentActiveRow}
				currentStep={currentStep}
				enabled={matrixCellEnabled}
			/>
		{/each}
	{/each}

	<!-- Footer Row -->
	<div class="col-span-1 mt-1 text-end text-xs font-medium text-alineados-gray-300">Resultado</div>
	<div></div>
	{#if $matrix.results}
		{#each $matrix.results.results as result, i}
			<div class="mt-1 flex items-center justify-center gap-[2px]">
				<div class="flex items-center justify-center text-3xl font-bold text-alineados-gray-900">
					{result}
				</div>
				{#if $matrix.results.winner === i}
					<StarSolid styleTw="size-4 text-alineados-green-900" />
				{/if}
			</div>
		{/each}
	{/if}
</div>

<!-- Mensaje informativo para ranking a la derecha -->
{#if currentStep === 1 && showRankingInfo}
	<div class="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 w-80 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg max-w-sm">
		<div class="flex items-start justify-between gap-3">
			<div class="flex items-start gap-3 flex-1">
				<div class="flex-shrink-0 mt-0.5">
					<svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
					</svg>
				</div>
				<div class="text-sm text-blue-800">
					<strong class="block mb-2">¿Cómo llenar el ranking?</strong>
					<p class="text-blue-700 leading-relaxed">
						Asigna <strong>3</strong> a la alternativa que <strong>más satisface</strong> el objetivo, <strong>2</strong> a la intermedia y <strong>1</strong> a la que <strong>menos satisface</strong>.
					</p>
				</div>
			</div>
			<button
				onclick={closeRankingInfo}
				class="flex-shrink-0 p-1 text-blue-400 hover:text-blue-600 transition-colors"
				aria-label="Cerrar información"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>
		</div> 
	</div>
{/if}

</div>

<!-- Tooltip personalizado -->
{#if tooltipVisible}
	<div 
		class="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2"
		style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px;"
	>
		{tooltipText}
		<!-- Flecha del tooltip -->
		<div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
	</div>
{/if}
