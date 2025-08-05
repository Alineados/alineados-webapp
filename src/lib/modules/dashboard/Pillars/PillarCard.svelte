<script lang="ts">
    import Lock from '$lib/icons/Lock.svelte';
    import { goto } from '$app/navigation';
    import Stars3 from '$lib/icons/Stars3.svelte';
    import Stars2 from '$lib/icons/Stars2.svelte';
    import Stars1 from '$lib/icons/Stars1.svelte';
    
    // Íconos de estado
    import SadFace from '$lib/icons/SadFace.svelte';
    import MedFace from '$lib/icons/MedFace.svelte';
    import HappyFace from '$lib/icons/HappyFace.svelte';
    
    // Props recibidas (manteniendo los nombres originales)
    export let icon; // Componente del ícono principal (ej. Brain)
    export let isActive: boolean = false; // Indica si la categoría está activa
    export let isProtected: boolean = false; // Indica si la categoría está protegida (según security)
    export let categoryName: string = ''; // Nombre de la categoría
    export let stateLevel: number = 0; // Estado: 1=SadFace, 2=MedFace, 3=HappyFace
    export let priorityLevel: number = 0; // Prioridad: 1,2,3
    export let pillarType: string;
    
    // Determinar el ícono de prioridad según priorityLevel
    $: priorityIcon =
        priorityLevel === 3 ? Stars3 :
        priorityLevel === 2 ? Stars2 :
        priorityLevel === 1 ? Stars1 : null;
    
    // Determinar el ícono de estado según stateLevel
    $: stateIcon =
        stateLevel === 1 ? SadFace :
        stateLevel === 2 ? MedFace :
        stateLevel === 3 ? HappyFace : null;
        
    // Fondo y color del ícono de estado
    $: stateBgColor =
        stateLevel === 1 ? 'bg-red-100' :
        stateLevel === 2 ? 'bg-yellow-100' :
        stateLevel === 3 ? 'bg-alineados-green-100' : 'bg-gray-100';
        
    $: stateIconColor =
        stateLevel === 1 ? 'text-red-500' :
        stateLevel === 2 ? 'text-yellow-500' :
        stateLevel === 3 ? 'text-alineados-green-500' : 'text-gray-500';

    function handleClick() {
        // Normalize category name to lowercase and remove accents
        const normalizedCategory = categoryName.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        goto(`/personal/pillars/${pillarType}/${normalizedCategory}`);
    }
</script>

<div 
    class="flex flex-col items-center gap-4 rounded-2xl border bg-white p-6 shadow-md transition-all hover:shadow-lg w-64 cursor-pointer"
    on:click={handleClick}
>
	<!-- Header: Estado y Seguridad -->
	<div class="flex flex-row items-center gap-2">
	  <span class={`rounded-lg px-3 py-1 text-xs font-semibold ${isActive ? 'bg-alineados-green-100 text-alineados-green-700' : 'bg-gray-100 text-gray-500'}`}>
		{isActive ? 'Activo' : 'Inactivo'}
	  </span>
	  {#if isProtected}
	    <Lock class="h-8 w-8 text-gray-500" />
	  <!-- {:else}
	    <Unlock size={16} class="text-gray-500" /> -->
	  {/if}
	</div>
  
	<!-- Icono principal -->
	<div class="text-6xl text-gray-600">
	  <svelte:component this={icon} />
	</div>
  
	<!-- Nombre de la categoría -->
	<p class="text-xl font-bold text-gray-800">{categoryName}</p>
  
	<!-- Estado y Prioridad -->
	<div class="flex flex-row items-center justify-center gap-4">
	  <!-- Estado -->
	  <div class="flex flex-col items-center gap-2">
		<p class="text-sm font-semibold text-gray-400">Estado</p>
		<div class="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100">
		  {#if isActive}
		    {#if stateIcon}
		      <div class={`${stateBgColor} flex items-center justify-center rounded-lg w-full h-full`}>
		        <svelte:component this={stateIcon} class={`${stateIconColor} text-2xl`} />
		      </div>
		    {:else}
		      <span class="text-gray-500 text-xs">-</span>
		    {/if}
		  {:else}
		    <span class="text-gray-500 text-xs">-</span>
		  {/if}
		</div>
	  </div>
  
	  <!-- Prioridad -->
	  <div class="flex flex-col items-center gap-2">
		<p class="text-sm font-semibold text-gray-400">Prioridad</p>
		<div class="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100">
		  {#if isActive && priorityIcon}
		    <svelte:component this={priorityIcon} class="text-yellow-500 text-2xl" />
		  {:else}
		    <span class="text-gray-500 text-xs">-</span>
		  {/if}
		</div>
	  </div>
	</div>
</div>