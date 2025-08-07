<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    // import History from '$lib/icons/History.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import InformationIcon from '$lib/icons/InformationIcon.svelte';
    // import ThumbsUp from '$lib/icons/ThumbsUp.svelte';
    // import ThumbsDown from '$lib/icons/ThumbsDown.svelte';
    import { nanoid } from 'nanoid';
    import { page } from '$app/stores';
    import { isPillarSaving, currentCategoryInfo, updateCategoryInfoAndSave, saveImmediately, safeUpdateCategoryInfo, loadFromStoreFirst } from '$lib/stores/pillar/category';
    import { userState } from '$lib/stores';
    import type { GenericItemDTO } from '$lib/services/personal/pillars';
    import { PillarService } from '$lib/services/personal/pillars';
    import { getContext, onMount } from 'svelte';
    import { getEndpointByVenv } from '$lib/services/endpoints';

    let { type }: { type: 'positive' | 'improve' } = $props();

    // Obtener el token del contexto
    const token = getContext<string>('token');
    const pillarService = PillarService.getInstance(token || '');

    // Obtener parámetros de la URL
    let pillar = $derived($page.params.pillar || '');
    let category = $derived($page.params.category || '');
    let categoryId = $derived($page.data?.categoryData?.id || '');

    // Estado local
    let pastActions = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    let isOnlyText = $state(true);
    let isLoading = $state(false);

    // Determinar el campo correcto según el tipo
    const fieldName = type === 'positive' ? 'positive_actions' : 'improve_actions';

    // Cargar acciones pasadas existentes
    async function loadPastActions() {
        console.log('loadPastActions called with:', { pillar, categoryId, userStateId: userState.id, type });
        
        if (!userState.id || !categoryId) {
            console.log('Missing required data for loadPastActions:', { userStateId: userState.id, categoryId });
            return;
        }
        
        isLoading = true;
        
        // Intentar cargar desde el store primero
        const storeItems = loadFromStoreFirst(fieldName, (items) => 
            items
                .filter((item: GenericItemDTO) => item.description && item.description.trim() !== '')
                .map((item: GenericItemDTO) => ({
                    id: item.id || nanoid(),
                    description: item.description,
                    prominent: item.favorite,
                    daily: item.repeated
                })), categoryId
        );
        
        if (storeItems.length > 0) {
            console.log(`Loaded ${fieldName} from store:`, storeItems.length, 'items');
            pastActions = [...storeItems, { id: nanoid(), description: '', prominent: false, daily: false }];
            isLoading = false;
            return;
        }
        
        // Si no hay datos en el store, cargar desde el backend
        try {
            const response = await pillarService.getCategoryInfo(pillar, categoryId, userState.id);
            console.log('loadPastActions response:', response);
            
            if (response.status === 200 && response.data) {
                const categoryInfo = response.data;
                safeUpdateCategoryInfo(categoryInfo, categoryId);
                
                // Cargar las acciones según el tipo
                const actions = categoryInfo[fieldName] || [];
                if (actions.length > 0) {
                    // Filtrar acciones no vacías del backend
                    const nonEmptyActions = actions
                        .filter((item: GenericItemDTO) => item.description && item.description.trim() !== '')
                        .map((item: GenericItemDTO) => ({
                            id: item.id || nanoid(),
                            description: item.description,
                            prominent: item.favorite,
                            daily: item.repeated
                        }));
                    
                    // Asegurar que siempre haya exactamente una acción vacía al final
                    pastActions = [...nonEmptyActions, { id: nanoid(), description: '', prominent: false, daily: false }];
                } else {
                    // Si no hay datos o todos están vacíos, crear una sola acción vacía
                    pastActions = [{ id: nanoid(), description: '', prominent: false, daily: false }];
                }
            } else {
                pastActions = [{ id: nanoid(), description: '', prominent: false, daily: false }];
            }
        } catch (error) {
            console.error('Error loading past actions:', error);
            pastActions = [{ id: nanoid(), description: '', prominent: false, daily: false }];
        } finally {
            isLoading = false;
        }
    }

    // Convertir acciones al formato backend
    function convertToGenericItems(): GenericItemDTO[] {
        return pastActions
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
            updateCategoryInfoAndSave({ [fieldName]: items });
        }
    });

    // Función para guardar cuando el usuario pierde el foco
    function handleBlur() {
        const items = convertToGenericItems();
        if (items.length > 0) {
            updateCategoryInfoAndSave({ [fieldName]: items });
        }
    }

    // Guardar al salir de la página
    onMount(() => {
        loadPastActions();
        
        // Función para guardar antes de salir/refresh
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const items = convertToGenericItems();
            if (items.length > 0) {
                // Mostrar confirmación al usuario
                event.preventDefault();
                event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
                return 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
            }
        };
        
        // Función para guardar síncronamente (para refresh)
        const savePastActionsSilentSync = () => {
            if (!userState.id || !categoryId) return;
            
            // Capturar TODAS las acciones actuales, incluyendo cambios pendientes
            const currentActions = pastActions.filter(e => e.description.trim() !== '');
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
            // Actualizar el campo correcto según el tipo
            categoryInfo[fieldName] = items;
            
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
        pastActions = [...pastActions, newAction];
    }

    function removeAction(id: string) {
        // No eliminar si es la última acción y está vacía
        if (pastActions.length === 1 && pastActions[0].description === '') {
            return;
        }
        
        // Eliminar la acción
        pastActions = pastActions.filter(e => e.id !== id);
        
        // Asegurar que siempre haya al menos una acción vacía al final
        if (pastActions.length === 0 || pastActions[pastActions.length - 1].description !== '') {
            pastActions = [...pastActions, { id: nanoid(), description: '', prominent: false, daily: false }];
        }
    }

    function toggleProminent(id: string) {
        pastActions = pastActions.map(e => e.id === id ? { ...e, prominent: !e.prominent } : e);
    }

    function toggleDaily(id: string) {
        pastActions = pastActions.map(e => e.id === id ? { ...e, daily: !e.daily } : e);
    }

    const title = type === 'positive' ? 'Acciones Pasado - Positivas' : 'Acciones Pasado - Por Mejorar';
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <h2 class="text-2xl font-medium text-alineados-gray-900">{title}</h2>
        <Tooltip
            open={false}
            messages={[
                type === 'positive' 
                    ? 'Acciones pasadas que han tenido un impacto positivo'
                    : 'Acciones pasadas que necesitan mejorarse',
                type === 'positive' 
                    ? 'Acciones únicas (no pensamientos) que ha realizado BIEN en el PASADO según su persona (no la opinión de un tercero)'
                    : 'Acciones únicas (no pensamientos) que ha realizado MAL en el PASADO según su persona (no la opinión de un tercero) '
            ]}
        >
            <InformationIcon styleTw="size-4" />
        </Tooltip>
        
        <!-- Indicador de estado de guardado -->
        
    </div>
    {#if isLoading}
        <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-alineados-blue-900"></div>
            <span class="ml-2 text-gray-600">Cargando acciones pasadas...</span>
        </div>
    {:else}
        <div class="-ml-10 mt-5 flex flex-col gap-2">
            {#each pastActions as action}
                <Item
                    deleteItem={() => removeAction(action.id)}
                    addItem={() => addAction(action.id)}
                    prominentItem={() => toggleProminent(action.id)}
                    dailyItem={() => toggleDaily(action.id)}
                    onInput={() => {
                        if (pastActions[pastActions.length - 1].description !== '' && action.id === pastActions[pastActions.length - 1].id) {
                            addAction(action.id);
                        }
                        if (action.description === '' && action.id !== pastActions[pastActions.length - 1].id) {
                            removeAction(action.id);
                        }
                    }}
                    onBlur={handleBlur}
                    bind:isOnlyText
                    bind:isDaily={action.daily}
                    bind:isStarred={action.prominent}
                    bind:value={action.description}
                    animate={pastActions.length === 1 && pastActions[0].description === ''}
                />
            {/each}
        </div>
    {/if}
</div>
