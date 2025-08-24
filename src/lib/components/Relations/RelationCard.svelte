<script lang="ts">
    import { goto } from '$app/navigation';
    import type { RelationListItem } from '$lib/interfaces/Relations.interface';
    import { getStateLevel, getStateColor } from '$lib/stores/relations/relations';
    import User from 'lucide-svelte/icons/user';
    
    // Íconos de estado (reutilizando los de pillars)
    import SadFace from '$lib/icons/SadFace.svelte';
    import MedFace from '$lib/icons/MedFace.svelte';
    import HappyFace from '$lib/icons/HappyFace.svelte';
    
    // Íconos de flechas
    import ArrowUp from 'lucide-svelte/icons/arrow-up';
    import ArrowDown from 'lucide-svelte/icons/arrow-down';
    import Star from 'lucide-svelte/icons/star';
    
    // Props
    export let relation: RelationListItem;
    
    // Calcular nivel y colores del estado
    $: stateLevel = getStateLevel(relation.status);
    $: stateColors = getStateColor(relation.status);
    
    // Determinar el ícono de estado según stateLevel
    $: stateIcon =
        stateLevel === 1 ? SadFace :
        stateLevel === 2 ? MedFace :
        stateLevel === 3 ? HappyFace : null;
    
    // Colores para las flechas
    function getArrowColor(value: boolean | null): string {
        if (value === null || value === undefined) return 'text-gray-400';
        return value ? 'text-alineados-green-500' : 'text-red-500';
    }
    
    $: iSeekThemColor = getArrowColor(relation.i_seek_them);
    $: theySeekMeColor = getArrowColor(relation.they_seek_me);

    function handleClick() {
        goto(`/relations/${relation.id}`);
    }
</script>

<div 
    class="flex flex-col items-center gap-3 rounded-2xl border bg-white p-4 shadow-md transition-all hover:shadow-lg w-64 cursor-pointer"
    onclick={handleClick}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === 'Enter' && handleClick()}
>
    <!-- Foto de perfil o placeholder -->
    <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {#if relation.photo_url}
            <img src={relation.photo_url} alt={relation.full_name} class="w-full h-full object-cover" />
        {:else}
            <User class="h-8 w-8 text-gray-500" />
        {/if}
    </div>
    
    <!-- Nombre de la relación -->
    <div class="flex items-center justify-center gap-2">
        <h3 class="text-lg font-bold text-gray-800 text-center line-clamp-2">
            {relation.full_name}
        </h3>
        {#if relation.highlighted}
            <Star class="size-5 text-yellow-500 fill-current flex-shrink-0" />
        {/if}
    </div>
    
    <!-- Flechas indicadoras -->
    <div class="flex flex-col items-center gap-1">
        <!-- Flecha hacia arriba: "Yo lo busco" -->
        <div class="flex items-center justify-center">
            <ArrowUp class="w-5 h-5 {iSeekThemColor}" />
        </div>
        
        <!-- Número: contador de encuentros anuales -->
        <div class="bg-gray-100 rounded-lg px-3 py-1">
            <span class="text-sm font-semibold text-gray-700">
                {relation.gatherings_count}
            </span>
        </div>
        
        <!-- Flecha hacia abajo: "Él me busca" -->
        <div class="flex items-center justify-center">
            <ArrowDown class="w-5 h-5 {theySeekMeColor}" />
        </div>
    </div>
    
    <!-- Estado (carita) -->
    <div class="flex items-center justify-center w-12 h-12 rounded-lg {stateColors.bg}">
        {#if stateIcon}
            <svelte:component this={stateIcon} class="{stateColors.icon} text-2xl" />
        {:else}
            <span class="text-gray-500 text-xs">-</span>
        {/if}
    </div>
    
    <!-- Área -->
    <div class="bg-alineados-gray-100 rounded-lg px-3 py-1 w-full">
        <p class="text-xs font-medium text-alineados-gray-700 text-center truncate">
            {relation.area_name || 'Sin área'}
        </p>
    </div>
</div>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
