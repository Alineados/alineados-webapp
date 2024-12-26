<script lang="ts">
	import { FilterBy } from '$lib/interfaces';

	import { filterBy } from '$lib/stores';
</script>

<p class=" pl-2 text-alineados-gray-400">
	{#if $filterBy === FilterBy.ACTIVE}
		No hay situaciones por mejorar activas registradas, para agregar una nueva haz clic en el botón de "+ Nuevo".
	{:else if $filterBy === FilterBy.INACTIVE}
		No hay situaciones por mejorar no activas.
	{:else}
		No hay situaciones por mejorar registradas, para agregar una nueva haz clic en el botón de "+ Nuevo".
	{/if}
</p>
