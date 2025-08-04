<script lang="ts">
    import ImagesCarousel from '$lib/components/ImagesCarousel.svelte';
    import Star from 'lucide-svelte/icons/star';
    import { nanoid } from 'nanoid';
    import PillarDocuments from './PillarDocuments.svelte';
    
    // Íconos de estado (como en PillarCard.svelte)
    import SadFace from '$lib/icons/SadFace.svelte';
    import MedFace from '$lib/icons/MedFace.svelte';
    import HappyFace from '$lib/icons/HappyFace.svelte';

    let priority = $state(0);
    let stateLevel = $state(3); // 1=SadFace, 2=MedFace, 3=HappyFace
    
    let associatedProblems = $state([
        { id: nanoid(), name: 'Problema 1 - Pharetra tincidunt lacus' },
        { id: nanoid(), name: 'Problema 2 - Pharetra tincidunt lacus' },
        { id: nanoid(), name: 'Problema 3 - Pharetra tincidunt lacus' }
    ]);

    function setPriority(value: number) {
        priority = value;
    }

    function setStateLevel(value: number) {
        stateLevel = value;
    }
    
    // Determinar el ícono de estado según stateLevel
    let stateIcon = $derived(
        stateLevel === 1 ? SadFace :
        stateLevel === 2 ? MedFace :
        stateLevel === 3 ? HappyFace : null
    );
        
    // Fondo y color del ícono de estado
    let stateBgColor = $derived(
        stateLevel === 1 ? 'bg-red-100' :
        stateLevel === 2 ? 'bg-yellow-100' :
        stateLevel === 3 ? 'bg-green-100' : 'bg-gray-100'
    );
        
    let stateIconColor = $derived(
        stateLevel === 1 ? 'text-red-500' :
        stateLevel === 2 ? 'text-yellow-500' :
        stateLevel === 3 ? 'text-green-500' : 'text-gray-500'
    );
</script>

<style>
    /* Hacer que los iconos SVG usen currentColor */
    .state-icon :global(svg) {
        color: currentColor;
    }
    
    .state-icon :global(svg path) {
        stroke: currentColor !important;
    }
</style>

<div class="w-80 space-y-8 ml-12">
    <div>
        <h3 class="mb-4 text-lg font-medium">Recuerdos</h3>
        <ImagesCarousel />
    </div>

    <!-- Contenedor Prioridad y Estado -->
    <div class="rounded-xl border border-gray-200 bg-white py-4 px-6">
        <div class="flex gap-8">
            <!-- Prioridad -->
            <div class="flex-1">
                <h3 class="mb-1 text-lg font-medium">Prioridad</h3>
                <div class="flex gap-1">
                    {#each Array(3) as _, i}
                        <button 
                            class="transition-colors"
                            onclick={() => setPriority(i + 1)}
                        >
                            <Star 
                                class="h-8 w-8 {i < priority ? 'text-yellow-400 fill-yellow-400' : 'text-alineados-gray-200 fill-transparent'}"
                            />
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Estado -->
            <div class="flex-1">
                <h3 class="mb-1 text-lg font-medium">Estado</h3>
                <div class="flex gap-4">
                    <button 
                        class="transition-colors"
                        onclick={() => setStateLevel(3)}
                    >
                        <div class="h-8 w-8 rounded-full flex items-center justify-center {stateLevel === 3 ? 'bg-green-500/20' : ''}">
                            <svelte:component this={HappyFace} class="h-8 w-8" />
                        </div>
                    </button>
                    <button 
                        class="transition-colors"
                        onclick={() => setStateLevel(2)}
                    >
                        <div class="h-8 w-8 rounded-full flex items-center justify-center {stateLevel === 2 ? 'bg-yellow-500/20' : ''}">
                            <svelte:component this={MedFace} class="h-8 w-8" />
                        </div>
                    </button>
                    <button 
                        class="transition-colors"
                        onclick={() => setStateLevel(1)}
                    >
                        <div class="h-8 w-8 rounded-full flex items-center justify-center {stateLevel === 1 ? 'bg-red-500/20' : ''}">
                            <svelte:component this={SadFace} class="h-8 w-8" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div>
        <h3 class="mb-4 text-lg font-medium">Problemas asociados</h3>
        <div class="space-y-2">
            {#each associatedProblems as problem}
                <div class="rounded-lg bg-white p-3 shadow">
                    <p class="text-sm text-alineados-gray-900">{problem.name}</p>
                </div>
            {/each}
        </div>
    </div>

    <div>
        <h3 class="mb-4 text-lg font-medium">Archivos adjuntos</h3>
        <PillarDocuments />
    </div>
</div>