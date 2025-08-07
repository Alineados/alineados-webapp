<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    // import Target from '$lib/icons/Target.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import InformationIcon from '$lib/icons/InformationIcon.svelte';
    import { nanoid } from 'nanoid';
    import { page } from '$app/stores';
    import { isPillarSaving, currentCategoryInfo, updateCategoryInfoAndSave, saveImmediately, safeUpdateCategoryInfo } from '$lib/stores/pillar/category';
    import { userState } from '$lib/stores';
    import type { GenericItemDTO } from '$lib/services/personal/pillars';
    import { PillarService } from '$lib/services/personal/pillars';
    import { getContext, onMount } from 'svelte';
    import { getEndpointByVenv } from '$lib/services/endpoints';

    // Obtener el token del contexto
    const token = getContext<string>('token');
    const pillarService = PillarService.getInstance(token || '');

    // Obtener parámetros de la URL
    let pillar = $derived($page.params.pillar || '');
    let category = $derived($page.params.category || '');
    let categoryId = $derived($page.data?.categoryData?.id || '');

    // Estado local
    let objectives = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    let isOnlyText = $state(true);
    let isLoading = $state(false);

    // Cargar objetivos existentes
    async function loadObjectives() {
        console.log('loadObjectives called with:', { pillar, categoryId, userStateId: userState.id });
        
        if (!userState.id || !categoryId) {
            console.log('Missing required data for loadObjectives:', { userStateId: userState.id, categoryId });
            return;
        }
        
        isLoading = true;
        try {
            const response = await pillarService.getCategoryInfo(pillar, categoryId, userState.id);
            console.log('loadObjectives response:', response);
            
            if (response.status === 200 && response.data) {
                const categoryInfo = response.data;
                safeUpdateCategoryInfo(categoryInfo);
                
                // Filtrar objetivos no vacíos del backend
                if (categoryInfo.objectives && categoryInfo.objectives.length > 0) {
                    const nonEmptyObjectives = categoryInfo.objectives
                        .filter((item: GenericItemDTO) => item.description && item.description.trim() !== '')
                        .map((item: GenericItemDTO) => ({
                            id: item.id || nanoid(),
                            description: item.description,
                            prominent: item.favorite,
                            daily: item.repeated
                        }));
                    
                    // Asegurar que siempre haya exactamente un objetivo vacío al final
                    objectives = [...nonEmptyObjectives, { id: nanoid(), description: '', prominent: false, daily: false }];
                } else {
                    // Si no hay datos o todos están vacíos, crear un solo objetivo vacío
                    objectives = [{ id: nanoid(), description: '', prominent: false, daily: false }];
                }
            } else {
                objectives = [{ id: nanoid(), description: '', prominent: false, daily: false }];
            }
        } catch (error) {
            console.error('Error loading objectives:', error);
            objectives = [{ id: nanoid(), description: '', prominent: false, daily: false }];
        } finally {
            isLoading = false;
        }
    }

    // Convertir objetivos al formato backend
    function convertToGenericItems(): GenericItemDTO[] {
        return objectives
            .filter(e => e.description.trim() !== '')
            .map(e => ({
                id: e.id,
                description: e.description,
                done: false,
                favorite: e.prominent,
                repeated: e.daily,
                deleted: false
            }));
    }

    // Auto-guardado debounce
    $effect(() => {
        const items = convertToGenericItems();
        if (items.length > 0) {
            updateCategoryInfoAndSave({ objectives: items });
        }
    });

    // Función para guardar cuando el usuario pierde el foco
    function handleBlur() {
        const items = convertToGenericItems();
        if (items.length > 0) {
            updateCategoryInfoAndSave({ objectives: items });
        }
    }

    // Guardar al salir de la página
    onMount(() => {
        loadObjectives();
        
        // Función para guardar antes de salir/refresh
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (objectives.some(e => e.description.trim() !== '')) {
                // Mostrar confirmación al usuario
                event.preventDefault();
                event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
                return 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
            }
        };
        
        // Función para guardar síncronamente (para refresh)
        const saveObjectivesSilentSync = () => {
            if (!userState.id || !categoryId) return;
            
            // Capturar TODOS los objetivos actuales, incluyendo cambios pendientes
            const currentObjectives = objectives.filter(e => e.description.trim() !== '');
            if (currentObjectives.length === 0) return;
            
            // Convertir al formato backend
            const items = currentObjectives.map(e => ({
                id: e.id,
                description: e.description,
                done: false,
                favorite: e.prominent,
                repeated: e.daily,
                deleted: false
            }));
            
            // Crear una nueva categoría si no existe
            let categoryInfo = $currentCategoryInfo;
            if (!categoryInfo) {
                categoryInfo = {
                    cid: categoryId,
                    uid: userState.id,
                    is_current: true,
                    elements: [],
                    objectives: [],
                    positive_actions: [],
                    improve_actions: [],
                    habits: [],
                    short_actions: [],
                    middle_actions: [],
                    long_actions: []
                };
            }
            categoryInfo.objectives = items;
            
            // Usar fetch síncrono para refresh
            const xhr = new XMLHttpRequest();
            const url = `${getEndpointByVenv().pillars}/api/v1/pillars/update-category-info?pillar=${pillar}`;
            xhr.open('POST', url, false); // false = síncrono
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(JSON.stringify(categoryInfo));
        };
        
        // Agregar listeners para diferentes eventos
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pagehide', handleBeforeUnload);
        window.addEventListener('unload', handleBeforeUnload);
        
        // Cleanup al desmontar
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('pagehide', handleBeforeUnload);
            window.removeEventListener('unload', handleBeforeUnload);
        };
    });

    // Lógica de UI
    function addObjective(id: string) {
        // Agregar un nuevo objetivo al final
        const newObjective = { id: nanoid(), description: '', prominent: false, daily: false };
        objectives = [...objectives, newObjective];
    }
    
    function removeObjective(id: string) {
        // No eliminar si es el último objetivo y está vacío
        if (objectives.length === 1 && objectives[0].description === '') {
            return;
        }
        
        // Eliminar el objetivo
        objectives = objectives.filter(e => e.id !== id);
        
        // Asegurar que siempre haya al menos un objetivo vacío al final
        if (objectives.length === 0 || objectives[objectives.length - 1].description !== '') {
            objectives = [...objectives, { id: nanoid(), description: '', prominent: false, daily: false }];
        }
    }
    function toggleProminent(id: string) {
        objectives = objectives.map(e => e.id === id ? { ...e, prominent: !e.prominent } : e);
    }
    function toggleDaily(id: string) {
        objectives = objectives.map(e => e.id === id ? { ...e, daily: !e.daily } : e);
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <!-- <Target styleTw="size-6 text-alineados-gray-900" /> -->
        <h2 class="text-2xl font-medium text-alineados-gray-900">Objetivos</h2>
        <Tooltip
            open={false}
            html={`
                <div class="text-xs text-alineados-blue-900 space-y-3 p-2">
                    <div>
                        <p class="font-semibold mb-2">Debe ser 1 objetivo que cubre la categoría; no hace un objetivo por cada elemento</p>
                        <p class="mb-2">Se recomienda iniciar con un verbo infinitivo (terminación ar-er-ir)</p>
                        <p class="mb-3">Se recomienda escribirlos de manera:</p>
                        <ul class="list-disc list-inside mb-3">
                            <li>Normal</li>
                            <li>SMART</li>
                        </ul>
                    </div>
                    
                    <div>
                        <p class="font-semibold mb-2">Tabla SMART:</p>
                        <table class="w-full text-xs border-collapse">
                            <thead>
                                <tr class="bg-gray-100">
                                    <th class="border border-gray-300 px-2 py-1 text-left">Letras</th>
                                    <th class="border border-gray-300 px-2 py-1 text-left">Palabra</th>
                                    <th class="border border-gray-300 px-2 py-1 text-left">Definición</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1 font-semibold">S</td>
                                    <td class="border border-gray-300 px-2 py-1">Específico</td>
                                    <td class="border border-gray-300 px-2 py-1">Define claramente qué se quiere lograr. Evita generalidades.</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1 font-semibold">M</td>
                                    <td class="border border-gray-300 px-2 py-1">Medible</td>
                                    <td class="border border-gray-300 px-2 py-1">Asegúrate de que el objetivo pueda cuantificarse para evaluar el progreso.</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1 font-semibold">A</td>
                                    <td class="border border-gray-300 px-2 py-1">Alcanzable</td>
                                    <td class="border border-gray-300 px-2 py-1">El objetivo debe ser realista y posible con los recursos disponibles.</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1 font-semibold">R</td>
                                    <td class="border border-gray-300 px-2 py-1">Relevante</td>
                                    <td class="border border-gray-300 px-2 py-1">Conecta el objetivo con las metas generales de tu negocio o proyecto.</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1 font-semibold">T</td>
                                    <td class="border border-gray-300 px-2 py-1">Tiempo<br>Definido</td>
                                    <td class="border border-gray-300 px-2 py-1">Establece un plazo concreto para cumplirlo.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `}
        >
            <InformationIcon styleTw="size-4" />
        </Tooltip>
        
        <!-- Indicador de estado de guardado -->
        
    </div>
    {#if isLoading}
        <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-alineados-blue-900"></div>
            <span class="ml-2 text-gray-600">Cargando objetivos...</span>
        </div>
    {:else}
        <div class="-ml-10 mt-5 flex flex-col gap-2">
            {#each objectives as objective}
                <Item
                    deleteItem={() => removeObjective(objective.id)}
                    addItem={() => addObjective(objective.id)}
                    prominentItem={() => toggleProminent(objective.id)}
                    dailyItem={() => toggleDaily(objective.id)}
                    onInput={() => {
                        if (objectives[objectives.length - 1].description !== '' && objective.id === objectives[objectives.length - 1].id) {
                            addObjective(objective.id);
                        }
                        if (objective.description === '' && objective.id !== objectives[objectives.length - 1].id) {
                            removeObjective(objective.id);
                        }
                    }}
                    onBlur={handleBlur}
                    bind:isOnlyText
                    bind:isDaily={objective.daily}
                    bind:isStarred={objective.prominent}
                    bind:value={objective.description}
                    animate={objectives.length === 1 && objectives[0].description === ''}
                />
            {/each}
        </div>
    {/if}
</div>
