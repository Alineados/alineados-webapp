<script lang="ts">
    import CardFilter from '$lib/components/CardFilter.svelte';
    import ViewButtonActions from '$lib/components/ViewButtonActions.svelte';
    import ExportButton from '$lib/components/ExportButton.svelte';
    import { filterBy } from '$lib/stores/pillar/card';
    import { goto } from '$app/navigation';
    import { exportAllCategoriesToPDF } from '$lib/utils/exportPillar';
    import { getEndpointByVenv } from '$lib/services/endpoints';
    import { userState } from '$lib/stores';
    import { getContext } from 'svelte';
    
    // Estado local para los filtros
    let cardFilter = {
        all: true,
        active: false,
        inactive: false
    };

    // Estado de loading para exportar
    let isExporting = $state(false);

    // Obtener el token del contexto
    const token = getContext<string>('token');

    function changeFilter(filter: keyof typeof cardFilter) {
        cardFilter.all = false;
        cardFilter.active = false;
        cardFilter.inactive = false;

        cardFilter[filter] = true;
        filterBy.set(filter);
    }

    // Función para exportar todas las categorías
    async function handleExportAll() {
        isExporting = true;
        try {
            // Obtener todos los pilares
            const response = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/get-all?uid=${userState.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error('Error fetching pillars:', response.status);
                return;
            }

            const pillarsData = await response.json();
            
            // Procesar cada pilar y sus categorías
            const allCategoriesExportData = [];
            
            // Procesar Health
            if (pillarsData.data.health && pillarsData.data.health.categories) {
                for (const category of pillarsData.data.health.categories) {
                    try {
                        const categoryResponse = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/get-category-info?pillar=health&cid=${category.id}&uid=${userState.id}&is_current=true`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (categoryResponse.ok) {
                            const categoryInfo = await categoryResponse.json();
                            
                            // Convertir los datos al formato correcto para exportación
                            const exportCategoryInfo = {
                                cid: categoryInfo.data.cid,
                                uid: categoryInfo.data.uid,
                                is_current: categoryInfo.data.is_current,
                                elements: categoryInfo.data.elements?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                objectives: categoryInfo.data.objectives?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                positive_actions: categoryInfo.data.positive_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                improve_actions: categoryInfo.data.improve_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                habits: categoryInfo.data.habits?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                short_actions: categoryInfo.data.short_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                middle_actions: categoryInfo.data.middle_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                long_actions: categoryInfo.data.long_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || []
                            };

                            allCategoriesExportData.push({
                                categoryName: category.label,
                                categoryInfo: exportCategoryInfo,
                                pillarType: 'health',
                                categoryData: {
                                    priority: category.priority,
                                    state: category.state,
                                    active: category.active
                                }
                            });
                        }
                    } catch (error) {
                        console.error('Error fetching category info:', error);
                    }
                }
            }

            // Procesar Relational
            if (pillarsData.data.relational && pillarsData.data.relational.categories) {
                for (const category of pillarsData.data.relational.categories) {
                    try {
                        const categoryResponse = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/get-category-info?pillar=relational&cid=${category.id}&uid=${userState.id}&is_current=true`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (categoryResponse.ok) {
                            const categoryInfo = await categoryResponse.json();
                            
                            const exportCategoryInfo = {
                                cid: categoryInfo.data.cid,
                                uid: categoryInfo.data.uid,
                                is_current: categoryInfo.data.is_current,
                                elements: categoryInfo.data.elements?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                objectives: categoryInfo.data.objectives?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                positive_actions: categoryInfo.data.positive_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                improve_actions: categoryInfo.data.improve_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                habits: categoryInfo.data.habits?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                short_actions: categoryInfo.data.short_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                middle_actions: categoryInfo.data.middle_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                long_actions: categoryInfo.data.long_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || []
                            };

                            allCategoriesExportData.push({
                                categoryName: category.label,
                                categoryInfo: exportCategoryInfo,
                                pillarType: 'relational',
                                categoryData: {
                                    priority: category.priority,
                                    state: category.state,
                                    active: category.active
                                }
                            });
                        }
                    } catch (error) {
                        console.error('Error fetching category info:', error);
                    }
                }
            }

            // Procesar Vocational
            if (pillarsData.data.vocational && pillarsData.data.vocational.categories) {
                for (const category of pillarsData.data.vocational.categories) {
                    try {
                        const categoryResponse = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/get-category-info?pillar=vocational&cid=${category.id}&uid=${userState.id}&is_current=true`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (categoryResponse.ok) {
                            const categoryInfo = await categoryResponse.json();
                            
                            const exportCategoryInfo = {
                                cid: categoryInfo.data.cid,
                                uid: categoryInfo.data.uid,
                                is_current: categoryInfo.data.is_current,
                                elements: categoryInfo.data.elements?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                objectives: categoryInfo.data.objectives?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                positive_actions: categoryInfo.data.positive_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                improve_actions: categoryInfo.data.improve_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                habits: categoryInfo.data.habits?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                short_actions: categoryInfo.data.short_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                middle_actions: categoryInfo.data.middle_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                long_actions: categoryInfo.data.long_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || []
                            };

                            allCategoriesExportData.push({
                                categoryName: category.label,
                                categoryInfo: exportCategoryInfo,
                                pillarType: 'vocational',
                                categoryData: {
                                    priority: category.priority,
                                    state: category.state,
                                    active: category.active
                                }
                            });
                        }
                    } catch (error) {
                        console.error('Error fetching category info:', error);
                    }
                }
            }

            // Procesar Spiritual
            if (pillarsData.data.spiritual && pillarsData.data.spiritual.categories) {
                for (const category of pillarsData.data.spiritual.categories) {
                    try {
                        const categoryResponse = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/get-category-info?pillar=spiritual&cid=${category.id}&uid=${userState.id}&is_current=true`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (categoryResponse.ok) {
                            const categoryInfo = await categoryResponse.json();
                            
                            const exportCategoryInfo = {
                                cid: categoryInfo.data.cid,
                                uid: categoryInfo.data.uid,
                                is_current: categoryInfo.data.is_current,
                                elements: categoryInfo.data.elements?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                objectives: categoryInfo.data.objectives?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                positive_actions: categoryInfo.data.positive_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                improve_actions: categoryInfo.data.improve_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                habits: categoryInfo.data.habits?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                short_actions: categoryInfo.data.short_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                middle_actions: categoryInfo.data.middle_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || [],
                                long_actions: categoryInfo.data.long_actions?.map((item: any) => ({
                                    description: item.description,
                                    prominent: item.favorite,
                                    daily: item.repeated
                                })) || []
                            };

                            allCategoriesExportData.push({
                                categoryName: category.label,
                                categoryInfo: exportCategoryInfo,
                                pillarType: 'spiritual',
                                categoryData: {
                                    priority: category.priority,
                                    state: category.state,
                                    active: category.active
                                }
                            });
                        }
                    } catch (error) {
                        console.error('Error fetching category info:', error);
                    }
                }
            }

            // Exportar todas las categorías
            if (allCategoriesExportData.length > 0) {
                exportAllCategoriesToPDF({
                    categories: allCategoriesExportData,
                    pillarType: 'all'
                });
                console.log('All categories exported successfully');
            } else {
                console.log('No categories to export');
            }
        } catch (error) {
            console.error('Error exporting all categories:', error);
        } finally {
            isExporting = false;
        }
    }
</script>

<div class="flex flex-col gap-6 pb-6">
    <p class="flex flex-row text-sm font-medium text-alineados-gray-600">
        <button 
            onclick={() => goto('/personal')}
            class="text-alineados-gray-600 hover:underline"
        >
            Personal
        </button>
        <span class="mx-1">/</span>
        <span class="text-alineados-orange-900">Acciones</span>
    </p>
    <div class="flex flex-col gap-5 border-b border-alineados-gray-200 pb-6 lg:flex-row lg:justify-between">
        <p class="text-5xl font-bold text-alineados-blue-900">Acciones</p>
        <div class="flex flex-row gap-4 self-start">
            <ExportButton onClick={handleExportAll} isLoading={isExporting} />
            <ViewButtonActions />
            <ExportButton onClick={handleExportAll} isLoading={isExporting} />
        </div>
    </div>
</div>

<div class="flex flex-row gap-2 pb-6">
    <CardFilter type="simple" text="Todas" bind:selected={cardFilter.all} triggerFunction={() => changeFilter('all')} />
    <CardFilter type="simple" text="Activas" bind:selected={cardFilter.active} triggerFunction={() => changeFilter('active')} />
    <CardFilter type="simple" text="No Activas" bind:selected={cardFilter.inactive} triggerFunction={() => changeFilter('inactive')} />
</div>
