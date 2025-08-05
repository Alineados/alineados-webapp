<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    import Cube from '$lib/icons/Cube.svelte';
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
    import { toast } from 'svelte-sonner';

    // Obtener el token del contexto
    const token = getContext<string>('token');
    const pillarService = PillarService.getInstance(token || '');

    // Obtener parámetros de la URL
    let pillar = $derived($page.params.pillar);
    let category = $derived($page.params.category);

    // Obtener el ID de la categoría desde el contexto de la página
    let categoryId = $derived($page.data?.categoryData?.id || '');

    // Estado local
    let elements = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    let isOnlyText = $state(true);
    let isLoading = $state(false);
    let hasUnsavedChanges = $state(false);
    let lastSavedTime = $state<Date | null>(null);

    // Función para cargar datos existentes
    async function loadElements() {
        if (!userState.id || !categoryId) {
            return;
        }

        isLoading = true;

        try {
            const response = await pillarService.getCategoryInfo(pillar, categoryId, userState.id);

            if (response.status === 200 && response.data) {
                const categoryInfo = response.data;
                
                // Actualizar el store global
                $currentCategoryInfo = categoryInfo;

                // Convertir los elementos del backend al formato del frontend
                // Filtrar elementos vacíos del backend
                if (categoryInfo.elements && categoryInfo.elements.length > 0) {
                    const nonEmptyElements = categoryInfo.elements
                        .filter((item: GenericItemDTO) => item.description && item.description.trim() !== '')
                        .map((item: GenericItemDTO) => ({
                            id: item.id || nanoid(),
                            description: item.description,
                            prominent: item.favorite,
                            daily: item.repeated
                        }));
                    
                    // Asegurar que siempre haya exactamente un elemento vacío al final
                    elements = [...nonEmptyElements, { id: nanoid(), description: '', prominent: false, daily: false }];
                } else {
                    // Si no hay datos o todos están vacíos, crear un solo elemento vacío
                    elements = [{ id: nanoid(), description: '', prominent: false, daily: false }];
                }
            } else {
                // Si no hay datos, crear un elemento vacío
                elements = [{ id: nanoid(), description: '', prominent: false, daily: false }];
            }
        } catch (error) {
            console.error('Error loading elements:', error);
            // Si hay error, crear un elemento vacío
            elements = [{ id: nanoid(), description: '', prominent: false, daily: false }];
        } finally {
            isLoading = false;
        }
    }

    // Función para guardar cuando el usuario pierde el foco
    function handleBlur() {
        const items = convertToGenericItems();
        if (items.length > 0) {
            // Pequeño delay para asegurar que el valor se haya actualizado
            setTimeout(() => {
                saveElementsSilent();
            }, 100);
        }
    }

    // Guardar al salir de la página
    onMount(() => {
        loadElements();
        
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
        const saveElementsSilentSync = () => {
            if (!userState.id || !categoryId) return;
            
            // Capturar TODOS los elementos actuales, incluyendo cambios pendientes
            const currentElements = elements.filter(e => e.description.trim() !== '');
            if (currentElements.length === 0) return;
            
            // Convertir al formato backend
            const items = currentElements.map(e => ({
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
            categoryInfo.elements = items;
            
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

    // Función para convertir elementos al formato del backend
    function convertToGenericItems(): GenericItemDTO[] {
        return elements
            .filter(e => e.description.trim() !== '') // Solo elementos con contenido
            .map(e => ({
                id: e.id,
                description: e.description,
                done: false,
                favorite: e.prominent,
                repeated: e.daily,
                deleted: false
            }));
    }

    // Función para guardar elementos
    async function saveElements() {
        if (!userState.id || !categoryId) {
            toast.error('Usuario no autenticado o categoría no válida');
            return;
        }

        const items = convertToGenericItems();
        if (items.length === 0) {
            return; // No guardar si no hay elementos
        }

        $isPillarSaving = true;

        try {
            // Obtener la información actual de la categoría
            let categoryInfo = $currentCategoryInfo;
            
            if (!categoryInfo) {
                // Si no hay información, crear una nueva
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

            // Actualizar solo los elementos
            categoryInfo.elements = items;

            const response = await pillarService.updateCategoryInfo(categoryInfo, pillar);

            if (response.status === 200) {
                toast.success('Elementos guardados correctamente');
                // Actualizar el store con la nueva información
                $currentCategoryInfo = categoryInfo;
            } else {
                toast.error(response.message || 'Error al guardar elementos');
            }
        } catch (error) {
            console.error('Error saving elements:', error);
            toast.error('Error de conexión');
        } finally {
            $isPillarSaving = false;
        }
    }

    function addElement(id: string) {
        // Agregar un nuevo elemento al final
        const newElement = { id: nanoid(), description: '', prominent: false, daily: false };
        elements = [...elements, newElement];
    }

    function removeElement(id: string) {
        // No eliminar si es el último elemento y está vacío
        if (elements.length === 1 && elements[0].description === '') {
            return;
        }
        
        // Eliminar el elemento
        elements = elements.filter(e => e.id !== id);
        
        // Asegurar que siempre haya al menos un elemento vacío al final
        if (elements.length === 0 || elements[elements.length - 1].description !== '') {
            elements = [...elements, { id: nanoid(), description: '', prominent: false, daily: false }];
        }
    }

    function toggleProminent(id: string) {
        elements = elements.map(e => 
            e.id === id ? { ...e, prominent: !e.prominent } : e
        );
    }

    function toggleDaily(id: string) {
        elements = elements.map(e => 
            e.id === id ? { ...e, daily: !e.daily } : e
        );
    }

    // Auto-guardar cuando hay cambios
    $effect(() => {
        const items = convertToGenericItems();
        if (items.length > 0) {
            hasUnsavedChanges = true;
            // Debounce más agresivo para mejor UX
            const timeout = setTimeout(() => {
                saveElementsSilent();
            }, 1500); // Reducir a 1.5 segundos
            return () => clearTimeout(timeout);
        }
    });

    // Función para guardar elementos sin mostrar toast (auto-guardado)
    async function saveElementsSilent() {
        if (!userState.id || !categoryId) {
            return; // No mostrar error en auto-guardado
        }

        const items = convertToGenericItems();
        if (items.length === 0) {
            return; // No guardar si no hay elementos
        }

        $isPillarSaving = true;
        hasUnsavedChanges = true;

        try {
            // Obtener la información actual de la categoría
            let categoryInfo = $currentCategoryInfo;
            
            if (!categoryInfo) {
                // Si no hay información, crear una nueva
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

            // Actualizar solo los elementos
            categoryInfo.elements = items;

            const response = await pillarService.updateCategoryInfo(categoryInfo, pillar);

            if (response.status === 200) {
                // Actualizar el store con la nueva información
                $currentCategoryInfo = categoryInfo;
                hasUnsavedChanges = false;
                lastSavedTime = new Date();
                
                // Actualizar automáticamente el estado de la categoría
                await updateCategoryStateBasedOnContent(pillar, categoryId, userState.id, token);
            }
        } catch (error) {
            console.error('Error saving elements (silent):', error);
            // Mantener hasUnsavedChanges = true en caso de error
        } finally {
            $isPillarSaving = false;
        }
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <Cube styleTw="size-6 text-alineados-gray-900" />
        <h2 class="text-2xl font-medium text-alineados-gray-900">Elementos</h2>
        <Tooltip
            open={false}
            messages={[
                'Lista de elementos importantes para este pilar',
                'Cada elemento debe ser conciso y específico'
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
            <span class="ml-2 text-gray-600">Cargando elementos...</span>
        </div>
    {:else}
        <div class="-ml-10 mt-5 flex flex-col gap-2">
            {#each elements as element}
                <Item
                    deleteItem={() => removeElement(element.id)}
                    addItem={() => addElement(element.id)}
                    prominentItem={() => toggleProminent(element.id)}
                    dailyItem={() => toggleDaily(element.id)}
                    onInput={() => {
                        // Si el usuario comienza a escribir en el último elemento, agregar uno nuevo
                        if (element.description !== '' && element.id === elements[elements.length - 1].id) {
                            addElement(element.id);
                        }
                        // Solo manejar la eliminación de elementos vacíos que no sean el último
                        if (element.description === '' && element.id !== elements[elements.length - 1].id) {
                            removeElement(element.id);
                        }
                    }}
                    onBlur={handleBlur}
                    bind:isOnlyText
                    bind:isDaily={element.daily}
                    bind:isStarred={element.prominent}
                    bind:value={element.description}
                />
            {/each}
        </div>
    {/if}
</div>