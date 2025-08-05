<script lang="ts">
    import ImagesCarousel from '$lib/components/ImagesCarousel.svelte';
    import Star from 'lucide-svelte/icons/star';
    import { nanoid } from 'nanoid';
    import PillarDocuments from './PillarDocuments.svelte';
    import { page } from '$app/stores';
    import { getContext } from 'svelte';
    import type { CategoryDTO } from '$lib/services/personal/pillars';
    import { PillarService } from '$lib/services/personal/pillars';
    import { isPillarSaving } from '$lib/stores/pillar/category';
    import { userState } from '$lib/stores';
    
    // Íconos de estado (como en PillarCard.svelte)
    import SadFace from '$lib/icons/SadFace.svelte';
    import MedFace from '$lib/icons/MedFace.svelte';
    import HappyFace from '$lib/icons/HappyFace.svelte';

    // Props recibidas
    let { categoryData = null, pillarType = '' } = $props<{
        categoryData?: any | null;
        pillarType?: string;
    }>();

    // Obtener el token del contexto
    const token = getContext<string>('token');
    const pillarService = PillarService.getInstance(token || '');

    // Obtener parámetros de la URL
    let pillar = $derived($page.params.pillar);
    let category = $derived($page.params.category);

    // Estado local basado en los datos recibidos
    let priority = $state(categoryData?.priority || 0);
    let stateLevel = $state(categoryData?.state || 0); // 0=ninguna, 1=SadFace, 2=MedFace, 3=HappyFace
    
    let associatedProblems = $state([
        { id: nanoid(), name: 'Problema 1 - Pharetra tincidunt lacus' },
        { id: nanoid(), name: 'Problema 2 - Pharetra tincidunt lacus' },
        { id: nanoid(), name: 'Problema 3 - Pharetra tincidunt lacus' }
    ]);

    // Actualizar estado local cuando cambien los datos
    $effect(() => {
        if (categoryData) {
            priority = categoryData.priority || 0;
            stateLevel = categoryData.state || 0;
        }
    });

    async function setPriority(value: number) {
        priority = value;
        await updateCategory();
    }

    async function setStateLevel(value: number) {
        stateLevel = value;
        await updateCategory();
    }

    async function updateCategory() {
        if (!categoryData || !pillar) return;
        
        // Validar que tenemos un usuario válido
        if (!userState.id) {
            return;
        }

        $isPillarSaving = true;

        try {
            const updatedCategoryData: CategoryDTO = {
                id: categoryData.id,
                label: categoryData.label,
                name: categoryData.name,
                active: categoryData.active,
                state: stateLevel,
                priority: priority,
                security: categoryData.security || false
            };

            const response = await pillarService.updateCategory(updatedCategoryData, pillar, userState.id);

            if (response.status === 200) {
                // Actualizar los datos locales
                categoryData = updatedCategoryData;
            }
        } catch (error) {
            console.error('Error updating category:', error);
        } finally {
            $isPillarSaving = false;
        }
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

    /* Animación de parpadeo naranja */
    .animate-border-cursor-blink {
        animation: border-cursor-blink 1.3s steps(1) infinite;
    }
    
    @keyframes border-cursor-blink {
        0%, 100% { border-color: rgb(249 115 22); }
        50% { border-color: transparent; }
    }
</style>

<div class="w-80 space-y-8 ml-12">
    <div>
        <h3 class="mb-4 text-lg font-medium">Recuerdos</h3>
        <ImagesCarousel />
    </div>

    <!-- Contenedor Prioridad y Estado -->
    <div class="rounded-xl border border-gray-200 bg-white py-4 px-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
            <!-- Prioridad -->
            <div class="flex-1 min-w-0">
                <h3 class="mb-1 text-lg font-medium">Prioridad</h3>
                <div class={`inline-flex gap-1 px-1 py-1 rounded-lg border-2 ${priority === 0 ? 'border-orange-500 animate-border-cursor-blink' : 'border-transparent'}`}>
                    {#each Array(3) as _, i}
                        <button 
                            class="transition-colors flex-shrink-0 {$isPillarSaving ? 'opacity-50 cursor-not-allowed' : ''}"
                            onclick={() => setPriority(i + 1)}
                            disabled={$isPillarSaving}
                        >
                            <Star 
                                class="h-8 w-8 {i < priority ? 'text-yellow-400 fill-yellow-400' : 'text-alineados-gray-200 fill-transparent'}"
                            />
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Estado -->
            <div class="flex-1 min-w-0">
                <h3 class="mb-1 text-lg font-medium">Estado</h3>
                <div class={`inline-flex gap-2 px-1 py-1 rounded-lg border-2 ${stateLevel === 0 ? 'border-orange-500 animate-border-cursor-blink' : 'border-transparent'}`}>
                    <button 
                        class="transition-all duration-200 flex-shrink-0 {$isPillarSaving ? 'opacity-50 cursor-not-allowed' : ''}"
                        onclick={() => setStateLevel(3)}
                        disabled={$isPillarSaving}
                    >
                        <div class="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 {
                            stateLevel === 3 
                                ? 'bg-green-500/20 ring-2 ring-green-500/50 scale-110' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }">
                            <svelte:component this={HappyFace} class="h-8 w-8 {stateLevel === 3 ? 'text-green-600' : 'text-gray-400'}" />
                        </div>
                    </button>
                    <button 
                        class="transition-all duration-200 flex-shrink-0 {$isPillarSaving ? 'opacity-50 cursor-not-allowed' : ''}"
                        onclick={() => setStateLevel(2)}
                        disabled={$isPillarSaving}
                    >
                        <div class="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 {
                            stateLevel === 2 
                                ? 'bg-yellow-500/20 ring-2 ring-yellow-500/50 scale-110' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }">
                            <svelte:component this={MedFace} class="h-8 w-8 {stateLevel === 2 ? 'text-yellow-600' : 'text-gray-400'}" />
                        </div>
                    </button>
                    <button 
                        class="transition-all duration-200 flex-shrink-0 {$isPillarSaving ? 'opacity-50 cursor-not-allowed' : ''}"
                        onclick={() => setStateLevel(1)}
                        disabled={$isPillarSaving}
                    >
                        <div class="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 {
                            stateLevel === 1 
                                ? 'bg-red-500/20 ring-2 ring-red-500/50 scale-110' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }">
                            <svelte:component this={SadFace} class="h-8 w-8 {stateLevel === 1 ? 'text-red-600' : 'text-gray-400'}" />
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