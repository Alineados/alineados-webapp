<script lang="ts">
	import { FilterBy } from '$lib/interfaces';

	import { filterBy } from '$lib/stores';
</script>

<p class=" pl-2 text-alineados-gray-400">
	{#if $filterBy === FilterBy.ACTIVE}
		No hay problemas activos registrados, para agregar uno nuevo haz clic en el botón de "+ Nuevo".
	{:else if $filterBy === FilterBy.INACTIVE}
		No hay problemas inactivos registrados
	{:else}
		No hay problemas registrados, para agregar uno nuevo haz clic en el botón de "+ Nuevo".
	{/if}
</p>
