<script lang="ts">
	import StarSolid from '$lib/icons/StarSolid.svelte';
	import { problemInfo, matrix } from '$lib/stores';
	import MatrixCell from './MatrixCell.svelte';
	import RowMatrix from './RowMatrix.svelte';

	let colors = ['text-alineados-green-900', 'text-alineados-orange-900', 'text-alineados-blue-900'];

	function setColor(i: number): string {
		return colors[i];
	}

	$inspect("$matrix -> ", $matrix);
</script>

<div class="grid grid-cols-[200px,25px,100px,100px,100px] gap-4 p-4">
	<!-- Header Row -->
	<div></div>
	<div></div>
	{#each Array(3) as _, index}
		{#if $problemInfo.alternatives[index]}
			{#if index === 0 && $problemInfo.alternatives[index].description === ''}
				<div class="text-center text-xs font-medium text-alineados-gray-300">
					Alternativa {index + 1}
				</div>
			{:else}
				<div class="text-center text-xs font-medium text-alineados-gray-300">
					{$problemInfo.alternatives[index].description}
				</div>
			{/if}
		{:else}
			<div class="text-center text-xs font-medium text-alineados-gray-300">
				Alternativa {index + 1}
			</div>
		{/if}
	{/each}

	<!-- Subheader Row -->
	<div class="-mb-3"></div>
	<div class="-mb-3"></div>
	<div class="-mb-3">
		<span class="text-xs font-medium text-alineados-gray-300">Alternativas &rarr;</span>
	</div>
	<div class="-mb-3"></div>
	<div class="-mb-3"></div>

	<!-- Rows -->
	{#each $matrix.rows as row, i}
		<RowMatrix rowIndex={i} color={setColor(i)} />
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
		{#each row.cells as cell}
			<MatrixCell color={setColor(i)} />
		{/each}
	{/each}

	<!-- Footer Row -->
	<div class="col-span-1 mt-1 text-end text-xs font-medium text-alineados-gray-300">Resultado</div>
	<div></div>
	{#if $matrix.results}
		{#each $matrix.results.cells as result}
			<div class="mt-1 flex items-center justify-center gap-[2px]">
				<div class="flex items-center justify-center text-xl font-medium text-alineados-gray-700">
					7
				</div>
				{#if result.winner}
					<StarSolid styleTw="size-4 text-alineados-green-900" />
				{/if}
			</div>
		{/each}
	{/if}
</div>
