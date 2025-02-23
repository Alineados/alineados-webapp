<script lang="ts">
	import Padlock from '$lib/icons/PadLock.svelte';
	import Stars3 from '$lib/icons/Stars3.svelte';
	import Stars2 from '$lib/icons/Stars2.svelte';
	import Stars1 from '$lib/icons/Stars1.svelte';
	
	// Props que se reciben (manteniendo los nombres originales)
	export let icon; // Componente del ícono (e.g., Brain)
	export let isActive: boolean = false; // Si está activo o no
	export let isProtected: boolean = false; // Si tiene candado
	export let categoryName: string = ''; // Nombre de la categoría
	export let stateIcon; // Componente del ícono del estado (e.g., SadFace)
	export let priorityLevel: number = 0; // Nivel de prioridad (1-3 estrellas)
	
	// Seleccionar el ícono según la prioridad
	$: priorityIcon = priorityLevel === 3 ? Stars3 : priorityLevel === 2 ? Stars2 : Stars1;
</script>

<div class="flex flex-col items-center gap-4 rounded-2xl border bg-white p-6 shadow-md transition-all hover:shadow-lg w-64">
	<!-- Header -->
	<div class="flex flex-row items-center gap-2">
	  <span class={`rounded-lg px-3 py-1 text-xs font-semibold ${
		  isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
		}`}>
		{isActive ? 'Activo' : 'Inactivo'}
	  </span>
	  {#if isProtected}
		<Padlock size={16} class="text-gray-500" />
	  {/if}
	</div>
  
	<!-- Icon principal -->
	<div class="text-6xl text-gray-600">
	  <svelte:component this={icon} />
	</div>
  
	<!-- Nombre de la categoría -->
	<p class="text-xl font-bold text-gray-800">{categoryName}</p>
  
	<!-- Estado y Prioridad -->
	<div class="flex flex-row items-center justify-center gap-8">
	  <!-- Estado -->
	  <div class="flex flex-col items-center gap-2">
		<p class="text-sm font-semibold text-gray-400">Estado</p>
		<div class="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100">
		  {#if isActive}
			<svelte:component this={stateIcon} class="text-red-500 text-2xl" />
		  {:else}
			<span class="text-gray-500 text-xs">N/A</span>
		  {/if}
		</div>
	  </div>
  
	  <!-- Prioridad -->
	  <div class="flex flex-col items-center gap-2">
		<p class="text-sm font-semibold text-gray-400">Prioridad</p>
		<div class="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100">
		  {#if isActive}
			<svelte:component this={priorityIcon} class="text-yellow-500 text-2xl" />
		  {:else}
			<span class="text-gray-500 text-xs">N/A</span>
		  {/if}
		</div>
	  </div>
	</div>
</div>
