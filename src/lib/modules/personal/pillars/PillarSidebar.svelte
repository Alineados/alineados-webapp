<script lang="ts">
    import ImagesCarousel from '$lib/components/ImagesCarousel.svelte';
    import Star from 'lucide-svelte/icons/star';
    import { nanoid } from 'nanoid';
    import PillarDocuments from './PillarDocuments.svelte';
    import { page } from '$app/stores';
    import { getContext } from 'svelte';
    import { goto } from '$app/navigation';
    import { isPillarSaving, currentCategoryActive, globalRequiredFieldsComplete } from '$lib/stores/pillar/category';
    import { userState } from '$lib/stores';
    import { PillarService } from '$lib/services/personal/pillars';
    import type { CategoryDTO } from '$lib/services/personal/pillars';
    import type { ProblemCard } from '$lib/interfaces/personal/Problem.interface';
    import type { Categories } from '$lib/interfaces/Pillar.interface';
    
    // Íconos de estado (como en PillarCard.svelte)
    import SadFace from '$lib/icons/SadFace.svelte';
    import MedFace from '$lib/icons/MedFace.svelte';
    import HappyFace from '$lib/icons/HappyFace.svelte';

    // Props recibidas
    let { categoryData = null, pillarType = '', associatedProblems = [] } = $props<{
        categoryData?: Categories | null;
        pillarType?: string;
        associatedProblems?: ProblemCard[];
    }>();

    // Estado para paginación de problemas
    let currentProblemPage = $state(0);
    const problemsPerPage = 3;
    
    // Computed values para paginación
    let totalProblemPages = $derived(Math.ceil(associatedProblems.length / problemsPerPage));
    let paginatedProblems = $derived.by(() => {
        const start = currentProblemPage * problemsPerPage;
        const end = start + problemsPerPage;
        return associatedProblems.slice(start, end);
    });
    let showPagination = $derived(associatedProblems.length > problemsPerPage);

    // Función para cambiar página
    function goToProblemPage(page: number) {
        if (page >= 0 && page < totalProblemPages) {
            currentProblemPage = page;
        }
    }

    // Reset página cuando cambien los problemas
    $effect(() => {
        if (associatedProblems.length > 0 && currentProblemPage >= totalProblemPages) {
            currentProblemPage = 0;
        }
    });

    // Obtener el token del contexto
    const token = getContext<string>('token');
    const pillarService = PillarService.getInstance(token || '');

    // Obtener parámetros de la URL
    let pillar = $derived($page.params.pillar);
    let category = $derived($page.params.category);

    // Estado local basado en los datos recibidos
    let priority = $state(categoryData?.priority || 0);
    let stateLevel = $state(categoryData?.state || 0); // 0=ninguna, 1=SadFace, 2=MedFace, 3=HappyFace
    
    // Lógica de prioridad para el parpadeo
    let requiredFieldsComplete = $derived(priority > 0 && stateLevel > 0);
    let shouldBlinkPriority = $derived(priority === 0);
    let shouldBlinkState = $derived(stateLevel === 0);
    
    // Solo otros campos pueden parpadear cuando los requeridos estén completos
    let canBlinkOtherFields = $derived(requiredFieldsComplete);

    // Efecto para actualizar el store global cuando cambien los campos requeridos
    $effect(() => {
        globalRequiredFieldsComplete.set(requiredFieldsComplete);
    });

    // Actualizar estado local cuando cambien los datos
    $effect(() => {
        if (categoryData) {
            priority = categoryData.priority || 0;
            stateLevel = categoryData.state || 0;
        }
    });

    // Función para navegar al problema
    function navigateToProblem(problemId: string) {
        // Necesitamos obtener el nombre del pilar para la navegación
        const pillarName = getPillarName(pillarType || pillar || '');
        const url = `/personal/problems/edit?pid=${problemId}&pillar_name=${pillarName}`;
        
        goto(url);
    }

    // Función para convertir el label del pilar al nombre interno
    function getPillarName(pillarLabel: string): string {
        switch (pillarLabel.toLowerCase()) {
            case 'health':
            case 'salud':
                return 'health';
            case 'relational':
            case 'relaciones':
            case 'relación':
                return 'relational';
            case 'vocational':
            case 'vocaciones':
            case 'vocación':
                return 'vocational';
            case 'spiritual':
            case 'espiritual':
                return 'spiritual';
            default:
                return pillarLabel;
        }
    }

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

        // Validar campos obligatorios antes de enviar
        if (priority === 0 || stateLevel === 0) {
            console.log('⚠️ Required fields not complete - Priority:', priority, 'State:', stateLevel);
            return;
        }

        $isPillarSaving = true;

        try {
            // El backend requiere state entre 1 y 3. Si está en 0, enviar 1 por defecto
            const safeState = stateLevel && stateLevel >= 1 && stateLevel <= 3 ? stateLevel : 1;
            const updatedCategoryData: CategoryDTO = {
                id: categoryData.id,
                label: categoryData.label,
                name: categoryData.name,
                active: $currentCategoryActive !== null ? $currentCategoryActive : categoryData.active,
                state: safeState,
                priority: priority,
                security: categoryData.security || false
            };

            console.log('🔍 PillarSidebar - Updating category:', updatedCategoryData);
            console.log('🔍 PillarSidebar - Pillar type:', pillar);
            console.log('🔍 PillarSidebar - User ID:', userState.id);

            const response = await pillarService.updateCategory(updatedCategoryData, pillar, userState.id);

            console.log('🔍 PillarSidebar - Response:', response);

            if (response.status === 200) {
                // Actualizar los datos locales
                categoryData = updatedCategoryData;
                console.log('✅ PillarSidebar - Category updated successfully');
            } else {
                console.error('❌ PillarSidebar - Error response:', response);
            }
        } catch (error) {
            console.error('❌ PillarSidebar - Error updating category:', error);
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
                <div class={`inline-flex gap-1 px-1 py-1 rounded-lg border-2 ${shouldBlinkPriority ? 'border-orange-500 animate-border-cursor-blink' : 'border-transparent'}`}>
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
                <div class={`inline-flex gap-2 px-1 py-1 rounded-lg border-2 ${shouldBlinkState ? 'border-orange-500 animate-border-cursor-blink' : 'border-transparent'}`}>
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
        <h3 class="mb-4 text-lg font-medium">Situaciones por mejorar asociados</h3>
        {#if associatedProblems.length > 0}
            <div class="space-y-2">
                {#each paginatedProblems as problem}
                    <div 
                        class="rounded-lg bg-white p-3 shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                        onclick={() => navigateToProblem(problem.id)}
                        role="button"
                        tabindex="0"
                        onkeydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                navigateToProblem(problem.id);
                            }
                        }}
                    >
                        <p class="text-sm text-alineados-gray-900 font-medium">{problem.problem_name}</p>
                        <div class="flex items-center justify-between mt-2">
                            <span class="text-xs text-gray-500">Progreso: {problem.progress}%</span>
                            <div class="flex items-center gap-1">
                                <div class="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        class="h-full bg-alineados-blue-500 transition-all duration-300"
                                        style="width: {problem.progress}%"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
            {#if showPagination}
                <div class="flex justify-center items-center gap-2 mt-4">
                    {#each Array(totalProblemPages) as _, index}
                        <button
                            class="w-2 h-2 rounded-full transition-all duration-200 {
                                index === currentProblemPage 
                                    ? 'bg-alineados-blue-500 scale-125' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }"
                            onclick={() => goToProblemPage(index)}
                            aria-label="Ir a página {index + 1}"
                        ></button>
                    {/each}
                </div>
            {/if}
        {:else}
            <div class="text-center py-6 text-gray-500">
                <p class="text-sm">No hay situaciones por mejorar asociados a esta categoría</p>
            </div>
        {/if}
    </div>

    <div>
        <h3 class="mb-4 text-lg font-medium">Archivos adjuntos</h3>
        <PillarDocuments />
    </div>
</div>