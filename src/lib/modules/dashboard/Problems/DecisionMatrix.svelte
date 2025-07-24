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
	let worker: Worker;
	let api: any;
	function setColor(i: number): string {
		return colors[i];
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
</script>

<div class="grid gap-4 p-4 " style="grid-template-columns: {gridColumns}">
	<!-- Header Row -->
	<div></div>
	<div></div>

	{#each $matrix.cols as column, index}
		<div class="text-center text-xs font-medium text-alineados-gray-300">
			{column.name}
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
			/>
		{/each}
	{/each}

	<!-- Footer Row -->
	<div class="col-span-1 mt-1 text-end text-xs font-medium text-alineados-gray-300">Resultado</div>
	<div></div>
	{#if $matrix.results}
		{#each $matrix.results.results as result, i}
			<div class="mt-1 flex items-center justify-center gap-[2px]">
				<div class="flex items-center justify-center text-xl font-medium text-alineados-gray-700">
					{result}
				</div>
				{#if $matrix.results.winner === i}
					<StarSolid styleTw="size-4 text-alineados-green-900" />
				{/if}
			</div>
		{/each}
	{/if}
</div>
