<script lang="ts">
    import { getContext } from 'svelte';
    import { page } from '$app/stores';
    import { PillarService } from '$lib/services/personal/pillars';
    import { isPillarSaving, currentCategoryInfo } from '$lib/stores/pillar/category';
    import { userState } from '$lib/stores';
    import { toast } from 'svelte-sonner';
    import type { CategoryInfoDTO, GenericItemDTO } from '$lib/services/personal/pillars';

    // Props
    let { sectionName = '', items = [], categoryId = '' } = $props<{
        sectionName: string;
        items: GenericItemDTO[];
        categoryId: string;
    }>();

    // Obtener el token del contexto
    const token = getContext<string>('token');
    const pillarService = PillarService.getInstance(token || '');

    // Obtener parámetros de la URL
    let pillar = $derived($page.params.pillar);
    let category = $derived($page.params.category);

    // Función para guardar la sección
    async function saveSection() {
        if (!userState.id || !categoryId) {
            toast.error('Usuario no autenticado o categoría no válida');
            return;
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

            // Actualizar la sección correspondiente
            switch (sectionName) {
                case 'elements':
                    categoryInfo.elements = items;
                    break;
                case 'objectives':
                    categoryInfo.objectives = items;
                    break;
                case 'positive_actions':
                    categoryInfo.positive_actions = items;
                    break;
                case 'improve_actions':
                    categoryInfo.improve_actions = items;
                    break;
                case 'habits':
                    categoryInfo.habits = items;
                    break;
                case 'short_actions':
                    categoryInfo.short_actions = items;
                    break;
                case 'middle_actions':
                    categoryInfo.middle_actions = items;
                    break;
                case 'long_actions':
                    categoryInfo.long_actions = items;
                    break;
            }

            const response = await pillarService.updateCategoryInfo(categoryInfo, pillar);

            if (response.status === 200) {
                toast.success(`${sectionName} guardado correctamente`);
                // Actualizar el store con la nueva información
                $currentCategoryInfo = categoryInfo;
            } else {
                toast.error(response.message || `Error al guardar ${sectionName}`);
            }
        } catch (error) {
            console.error('Error saving section:', error);
            toast.error('Error de conexión');
        } finally {
            $isPillarSaving = false;
        }
    }

    // Exponer la función de guardado
    export { saveSection };
</script>

<!-- Este componente no renderiza nada, solo proporciona funcionalidad -->