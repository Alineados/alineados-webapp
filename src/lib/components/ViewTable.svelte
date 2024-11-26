<script>
	// Puedes definir los datos de la tabla aquí si es necesario
	let tableData = [
		['Estoy procrastinando mucho', 'Fila 1, Columna 2', 'Fila 1, Columna 3'],
		['Estoy procrastinando mucho', 'Fila 2, Columna 2', 'Fila 2, Columna 3'],
		['Estoy procrastinando mucho', 'Fila 3, Columna 2', 'Fila 3, Columna 3']
	];
</script>

<div class="overflow-x-auto rounded-xl border border-alineados-gray-100">
	<table class="min-w-full">
		<thead class="border-b border-alineados-gray-100 bg-alineados-gray-50">
			<tr>
				<th class="px-6 py-3 text-left text-base font-medium tracking-wider text-alineados-gray-700"
					>Nombre identificativo</th
				>
				<th class="px-6 py-3 text-left text-base font-medium tracking-wider text-alineados-gray-700"
					>Objetivos</th
				>
				<th class="px-6 py-3 text-left text-base font-medium tracking-wider text-alineados-gray-700"
					>Plan de acción</th
				>
			</tr>
		</thead>
		<tbody>
			{#each tableData as row, i}
				<tr class={i % 2 === 0 ? 'odd-row' : 'even-row'}>
					{#each row as cell}
						<td class="whitespace-nowrap px-6 py-4 text-base font-medium text-black">{cell}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.odd-row {
		background-color: #ffffff; /* Color para las filas impares */
	}

	.even-row {
		background-color: #f7f7f7; /* Color para las filas pares */
	}
</style>
