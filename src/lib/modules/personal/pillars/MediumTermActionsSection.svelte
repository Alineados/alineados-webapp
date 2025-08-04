<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import InformationIcon from '$lib/icons/InformationIcon.svelte';
    import SaveIndicator from '$lib/components/SaveIndicator.svelte';
    import { nanoid } from 'nanoid';
    import { page } from '$app/stores';
    import { isPillarSaving, currentCategoryInfo, updateCategoryStateBasedOnContent } from '$lib/stores/pillar/category';
    import { userState } from '$lib/stores';
    import type { GenericItemDTO } from '$lib/services/personal/pillars';
    import { PillarService } from '$lib/services/personal/pillars';
    import { getContext, onMount } from 'svelte';
    import { getEndpointByVenv } from '$lib/services/endpoints';

    // Obtener el token del contexto
    const token = getContext<string>('token');
    const pillarService = PillarService.getInstance(token || '');

    // Obtener parámetros de la URL
    let pillar = $derived($page.params.pillar);
    let category = $derived($page.params.category);
    let categoryId = $derived($page.data?.categoryData?.id || '');

    // Estado local
    let futureActions = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    let isOnlyText = $state(true);
    let isLoading = $state(false);
    let hasUnsavedChanges = $state(false);
    let lastSavedTime = $state<Date | null>(null);

    // Cargar acciones de mediano plazo existentes
    async function loadMediumTermActions() {
        if (!userState.id || !categoryId) return;
        isLoading = true;
        try {
            const response = await pillarService.getCategoryInfo(pillar, categoryId, userState.id);
            if (response.status === 200 && response.data) {
                const categoryInfo = response.data;
                $currentCategoryInfo = categoryInfo;
                
                // Filtrar acciones vacías del backend
                if (categoryInfo.middle_actions && categoryInfo.middle_actions.length > 0) {
                    const nonEmptyActions = categoryInfo.middle_actions
                        .filter((item: GenericItemDTO) => item.description && item.description.trim() !== '')
                        .map((item: GenericItemDTO) => ({
                            id: item.id || nanoid(),
                            description: item.description,
                            prominent: item.favorite,
                            daily: item.repeated
                        }));
                    
                    // Asegurar que siempre haya exactamente una acción vacía al final
                    futureActions = [...nonEmptyActions, { id: nanoid(), description: '', prominent: false, daily: false }];
                } else {
                    // Si no hay datos o todos están vacíos, crear una sola acción vacía
                    futureActions = [{ id: nanoid(), description: '', prominent: false, daily: false }];
                }
            } else {
                futureActions = [{ id: nanoid(), description: '', prominent: false, daily: false }];
            }
        } catch (error) {
            console.error('Error loading medium term actions:', error);
            futureActions = [{ id: nanoid(), description: '', prominent: false, daily: false }];
        } finally {
            isLoading = false;
        }
    }

    // Guardar acciones de mediano plazo silenciosamente
    async function saveMediumTermActionsSilent() {
        if (!userState.id || !categoryId) return;
        const items = convertToGenericItems();
        // Guardar siempre, incluso si no hay acciones (para limpiar el backend)
        $isPillarSaving = true;
        hasUnsavedChanges = true;
        try {
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
            categoryInfo.middle_actions = items;
            const response = await pillarService.updateCategoryInfo(categoryInfo, pillar);
            if (response.status === 200) {
                $currentCategoryInfo = categoryInfo;
                hasUnsavedChanges = false;
                lastSavedTime = new Date();
                
                // Actualizar automáticamente el estado de la categoría
                await updateCategoryStateBasedOnContent(pillar, categoryId, userState.id, token);
            }
        } catch (error) {
            console.error('Error saving medium term actions (silent):', error);
            // Mantener hasUnsavedChanges = true en caso de error
        } finally {
            $isPillarSaving = false;
        }
    }

    // Convertir acciones al formato backend
    function convertToGenericItems(): GenericItemDTO[] {
        return futureActions
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
        // Guardar siempre que haya cambios, incluso si no hay acciones (para eliminar del backend)
        hasUnsavedChanges = true;
        const timeout = setTimeout(() => {
            saveMediumTermActionsSilent();
        }, 1500); // Reducir a 1.5 segundos
        return () => clearTimeout(timeout);
    });

    // Guardar al perder foco
    function handleBlur() {
        const items = convertToGenericItems();
        if (items.length > 0) {
            setTimeout(() => {
                saveMediumTermActionsSilent();
            }, 100);
        }
    }

    // Guardar al salir de la página
    onMount(() => {
        loadMediumTermActions();
        
        // Función para guardar antes de salir/refresh
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                // Mostrar confirmación al usuario
                event.preventDefault();
                event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
                return 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
            }
        };
        
        // Función para guardar síncronamente (para refresh)
        const saveMediumTermActionsSilentSync = () => {
            if (!userState.id || !categoryId) return;
            
            // Capturar TODAS las acciones actuales, incluyendo cambios pendientes
            const currentActions = futureActions.filter(e => e.description.trim() !== '');
            if (currentActions.length === 0) return;
            
            // Convertir al formato backend
            const items = currentActions.map(e => ({
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
            categoryInfo.middle_actions = items;
            
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
    function addAction(id: string) {
        // Agregar una nueva acción al final
        const newAction = { id: nanoid(), description: '', prominent: false, daily: false };
        futureActions = [...futureActions, newAction];
    }

    function removeAction(id: string) {
        // No eliminar si es la última acción y está vacía
        if (futureActions.length === 1 && futureActions[0].description === '') {
            return;
        }
        
        // Eliminar la acción
        futureActions = futureActions.filter(e => e.id !== id);
        
        // Asegurar que siempre haya al menos una acción vacía al final
        if (futureActions.length === 0 || futureActions[futureActions.length - 1].description !== '') {
            futureActions = [...futureActions, { id: nanoid(), description: '', prominent: false, daily: false }];
        }
        
        // Forzar auto-save después de eliminar
        setTimeout(() => {
            saveMediumTermActionsSilent();
        }, 100);
    }

    function toggleProminent(id: string) {
        futureActions = futureActions.map(e => e.id === id ? { ...e, prominent: !e.prominent } : e);
    }

    function toggleDaily(id: string) {
        futureActions = futureActions.map(e => e.id === id ? { ...e, daily: !e.daily } : e);
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <h2 class="text-2xl font-medium text-alineados-gray-900">Acciones Futuro - Mediano plazo</h2>
        <Tooltip
            open={false}
            messages={[
                'Acciones planificadas para el mediano plazo (6-12 meses)',
                'Define acciones concretas y medibles'
            ]}
        >
            <InformationIcon styleTw="size-4" />
        </Tooltip>
        
        <!-- Indicador de estado de guardado -->
        <SaveIndicator {hasUnsavedChanges} {lastSavedTime} />
    </div>
    {#if isLoading}
        <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-alineados-blue-900"></div>
            <span class="ml-2 text-gray-600">Cargando acciones de mediano plazo...</span>
        </div>
    {:else}
        <div class="-ml-10 mt-5 flex flex-col gap-2">
            {#each futureActions as action}
                <Item
                    deleteItem={() => removeAction(action.id)}
                    addItem={() => addAction(action.id)}
                    prominentItem={() => toggleProminent(action.id)}
                    dailyItem={() => toggleDaily(action.id)}
                    onInput={() => {
                        // Si el usuario comienza a escribir en la última acción, agregar una nueva
                        if (action.description !== '' && action.id === futureActions[futureActions.length - 1].id) {
                            addAction(action.id);
                        }
                        // Solo manejar la eliminación de acciones vacías que no sean la última
                        if (action.description === '' && action.id !== futureActions[futureActions.length - 1].id) {
                            removeAction(action.id);
                        }
                    }}
                    onBlur={handleBlur}
                    bind:isOnlyText
                    bind:isDaily={action.daily}
                    bind:isStarred={action.prominent}
                    bind:value={action.description}
                />
            {/each}
        </div>
    {/if}
</div>