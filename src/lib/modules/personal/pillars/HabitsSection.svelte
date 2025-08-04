<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    import Repeat from '$lib/icons/Repeat.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import InformationIcon from '$lib/icons/InformationIcon.svelte';
    import SaveIndicator from '$lib/components/SaveIndicator.svelte';
    import { nanoid } from 'nanoid';
    import { page } from '$app/stores';
    import { isPillarSaving, currentCategoryInfo } from '$lib/stores/pillar/category';
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
    let habits = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    let isOnlyText = $state(true);
    let isLoading = $state(false);
    let hasUnsavedChanges = $state(false);
    let lastSavedTime = $state<Date | null>(null);

    // Cargar hábitos existentes
    async function loadHabits() {
        if (!userState.id || !categoryId) return;
        isLoading = true;
        try {
            const response = await pillarService.getCategoryInfo(pillar, categoryId, userState.id);
            if (response.status === 200 && response.data) {
                const categoryInfo = response.data;
                $currentCategoryInfo = categoryInfo;
                if (categoryInfo.habits && categoryInfo.habits.length > 0) {
                    habits = categoryInfo.habits.map((item: GenericItemDTO) => ({
                        id: item.id || nanoid(),
                        description: item.description,
                        prominent: item.favorite,
                        daily: item.repeated
                    }));
                }
                // Siempre agregar un hábito vacío al final
                habits = [...habits, { id: nanoid(), description: '', prominent: false, daily: false }];
            } else {
                habits = [{ id: nanoid(), description: '', prominent: false, daily: false }];
            }
        } catch (error) {
            console.error('Error loading habits:', error);
            habits = [{ id: nanoid(), description: '', prominent: false, daily: false }];
        } finally {
            isLoading = false;
        }
    }

    // Guardar hábitos silenciosamente
    async function saveHabitsSilent() {
        if (!userState.id || !categoryId) return;
        const items = convertToGenericItems();
        if (items.length === 0) return;
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
            categoryInfo.habits = items;
            const response = await pillarService.updateCategoryInfo(categoryInfo, pillar);
            if (response.status === 200) {
                $currentCategoryInfo = categoryInfo;
                hasUnsavedChanges = false;
                lastSavedTime = new Date();
            }
        } catch (error) {
            console.error('Error saving habits (silent):', error);
            // Mantener hasUnsavedChanges = true en caso de error
        } finally {
            $isPillarSaving = false;
        }
    }

    // Convertir hábitos al formato backend
    function convertToGenericItems(): GenericItemDTO[] {
        return habits
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
            hasUnsavedChanges = true;
            const timeout = setTimeout(() => {
                saveHabitsSilent();
            }, 1500); // Reducir a 1.5 segundos
            return () => clearTimeout(timeout);
        }
    });

    // Guardar al perder foco
    function handleBlur() {
        const items = convertToGenericItems();
        if (items.length > 0) {
            setTimeout(() => {
                saveHabitsSilent();
            }, 100);
        }
    }

    // Guardar al salir de la página
    onMount(() => {
        loadHabits();
        
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
        const saveHabitsSilentSync = () => {
            if (!userState.id || !categoryId) return;
            
            // Capturar TODOS los hábitos actuales, incluyendo cambios pendientes
            const currentHabits = habits.filter(e => e.description.trim() !== '');
            if (currentHabits.length === 0) return;
            
            // Convertir al formato backend
            const items = currentHabits.map(e => ({
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
            categoryInfo.habits = items;
            
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
    function addHabit(id: string) {
        const index = habits.findIndex(e => e.id === id);
        const newHabit = { id: nanoid(), description: '', prominent: false, daily: false };
        if (index !== -1) {
            habits = [
                ...habits.slice(0, index + 1),
                newHabit,
                ...habits.slice(index + 1)
            ];
        } else {
            habits = [...habits, newHabit];
        }
    }

    function removeHabit(id: string) {
        if (habits.length === 1 && habits[0].description === '') return;
        if (habits.find(e => e.id === id)?.description !== '' || habits.length > 1) {
            habits = habits.filter(e => e.id !== id);
            if (habits.length === 0 || habits[habits.length - 1].description !== '') {
                habits = [...habits, { id: nanoid(), description: '', prominent: false, daily: false }];
            }
        }
    }

    function toggleProminent(id: string) {
        habits = habits.map(e => e.id === id ? { ...e, prominent: !e.prominent } : e);
    }

    function toggleDaily(id: string) {
        habits = habits.map(e => e.id === id ? { ...e, daily: !e.daily } : e);
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <Repeat styleTw="size-6 text-alineados-gray-900" />
        <h2 class="text-2xl font-medium text-alineados-gray-900">Hábitos</h2>
        <Tooltip
            open={false}
            messages={[
                'Lista de hábitos para fortalecer este pilar',
                'Enfócate en hábitos específicos y medibles'
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
            <span class="ml-2 text-gray-600">Cargando hábitos...</span>
        </div>
    {:else}
        <div class="-ml-10 mt-5 flex flex-col gap-2">
            {#each habits as habit}
                <Item
                    deleteItem={() => removeHabit(habit.id)}
                    addItem={() => addHabit(habit.id)}
                    prominentItem={() => toggleProminent(habit.id)}
                    dailyItem={() => toggleDaily(habit.id)}
                    onInput={() => {
                        if (habits[habits.length - 1].description !== '' && habit.id === habits[habits.length - 1].id) {
                            addHabit(habit.id);
                        }
                        if (habit.description === '' && habit.id !== habits[habits.length - 1].id) {
                            removeHabit(habit.id);
                        }
                    }}
                    onBlur={handleBlur}
                    bind:isOnlyText
                    bind:isDaily={habit.daily}
                    bind:isStarred={habit.prominent}
                    bind:value={habit.description}
                />
            {/each}
        </div>
    {/if}
</div>