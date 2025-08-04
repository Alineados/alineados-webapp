<script lang="ts">
    import Lock from '$lib/icons/Lock.svelte';
    import Eye from '$lib/icons/Eye.svelte';
    import ElipsisVertical from '$lib/icons/ElipsisVertical.svelte';
    import Blocked from '$lib/icons/Blocked.svelte';
    import File from '$lib/icons/File.svelte';
    import CircleCheck from '$lib/icons/CircleCheck.svelte';
    import Cloud from '$lib/icons/Cloud.svelte';
    import Loading from '$lib/icons/Loading.svelte';
    import BackArrow from '$lib/icons/BackArrow.svelte';
    import type { DataPillar } from '$lib/interfaces';
    import { isPillarSaving, currentCategoryInfo, currentCategoryActive } from '$lib/stores/pillar/category';
    import { getContext } from 'svelte';
    import { getEndpointByVenv } from '$lib/services/endpoints';
    import { userState } from '$lib/stores';
    import { page } from '$app/stores';
    import { exportPillarToPDF } from '$lib/utils/exportPillar';

    let { 
        pillarInfo,
        category 
    }: { 
        pillarInfo: DataPillar;
        category: string;
    } = $props();
    
    // Inicializar con el estado real de la categoría
    let isActive = $state(false); // Inicializar como false por defecto
    let isProtected = $state(false);
    let showMenu = $state(false);
    let isUpdatingState = $state(false);

    // Obtener el token del contexto
    const token = getContext<string>('token');
    
    // Obtener parámetros de la URL
    let pillar = $derived($page.params.pillar);
    let categoryId = $derived($page.data?.categoryData?.id || '');

    // Actualizar el estado activo desde los datos de la página y el store global
    $effect(() => {
        const categoryData = $page.data?.categoryData;
        const globalActive = $currentCategoryActive;
        
        if (categoryData) {
            // Inicializar el store global con el estado de la página si no está definido
            if (globalActive === undefined) {
                currentCategoryActive.set(categoryData.active ?? false);
            }
            
            // Usar el estado global si está disponible, sino usar el de la página
            isActive = globalActive !== undefined ? globalActive : (categoryData.active ?? false);
        } else {
            // Usar el estado global si está disponible
            isActive = globalActive !== undefined ? globalActive : false;
        }
    });

    // Función para actualizar el estado de la categoría
    async function updateCategoryState(active: boolean) {
        if (!userState.id || !categoryId) return;
        
        isUpdatingState = true;
        try {
            const response = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/update-category-state?pillar=${pillar}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cid: categoryId,
                    uid: userState.id,
                    active: active
                })
            });
            
            if (response.ok) {
                // Actualizar el estado local y el store global solo si la respuesta fue exitosa
                isActive = active;
                currentCategoryActive.set(active);
                console.log(`Categoría ${active ? 'activada' : 'desactivada'} manualmente`);
            } else {
                console.error('Error updating category state:', response.status, response.statusText);
                // No actualizar el estado local si hubo error
            }
        } catch (error) {
            console.error('Error updating category state:', error);
            // No actualizar el estado local si hubo error
        } finally {
            isUpdatingState = false;
        }
    }

    // Función para exportar a PDF
    function handleExport() {
        const categoryData = $page.data?.categoryData;
        const globalCategoryInfo = $currentCategoryInfo;
        
        if (!categoryData) {
            console.error('No category data available for export');
            return;
        }
        
        // Usar la información global si está disponible, sino usar datos básicos
        const categoryInfo = globalCategoryInfo || {
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
        
        // Convertir los datos al formato correcto para exportación
        const exportCategoryInfo = {
            cid: categoryInfo.cid,
            uid: categoryInfo.uid || userState.id || '',
            is_current: categoryInfo.is_current,
            elements: categoryInfo.elements?.map(item => ({
                description: item.description,
                prominent: item.favorite,
                daily: item.repeated
            })) || [],
            objectives: categoryInfo.objectives?.map(item => ({
                description: item.description,
                prominent: item.favorite,
                daily: item.repeated
            })) || [],
            positive_actions: categoryInfo.positive_actions?.map(item => ({
                description: item.description,
                prominent: item.favorite,
                daily: item.repeated
            })) || [],
            improve_actions: categoryInfo.improve_actions?.map(item => ({
                description: item.description,
                prominent: item.favorite,
                daily: item.repeated
            })) || [],
            habits: categoryInfo.habits?.map(item => ({
                description: item.description,
                prominent: item.favorite,
                daily: item.repeated
            })) || [],
            short_actions: categoryInfo.short_actions?.map(item => ({
                description: item.description,
                prominent: item.favorite,
                daily: item.repeated
            })) || [],
            middle_actions: categoryInfo.middle_actions?.map(item => ({
                description: item.description,
                prominent: item.favorite,
                daily: item.repeated
            })) || [],
            long_actions: categoryInfo.long_actions?.map(item => ({
                description: item.description,
                prominent: item.favorite,
                daily: item.repeated
            })) || []
        };
        
        const exportData = {
            categoryName: category,
            categoryInfo: exportCategoryInfo,
            pillarType: pillar,
            categoryData: {
                priority: categoryData.priority,
                state: categoryData.state,
                active: categoryData.active
            }
        };
        
        try {
            exportPillarToPDF(exportData);
            console.log('PDF exported successfully');
        } catch (error) {
            console.error('Error exporting PDF:', error);
        }
        
        showMenu = false;
    }
</script>

<div class="flex flex-col gap-2 px-4 md:px-8 lg:px-16 w-full">
    <p class="flex flex-row text-sm font-medium text-alineados-gray-600">
        <a href="/personal" class="text-alineados-gray-600 hover:underline">Personal</a>
        <span class="mx-1">/</span>
        <a href="/personal/pillars" class="text-alineados-gray-600 hover:underline">Acciones</a>
        <span class="mx-1">/</span>
        <span class="text-alineados-orange-900 capitalize">{category}</span>
    </p>
    
    <div class="flex flex-col items-start gap-5 border-b border-alineados-gray-100 pb-4 lg:flex-row lg:justify-between">
        <div class="flex items-start gap-2">
            <h1 class="text-5xl font-bold capitalize">{category}</h1>
        </div>
        
        <div class="flex flex-row justify-start gap-4">
            <div class="flex items-center gap-2">
                <!-- Indicador de nube/loading -->
                <div class="flex items-center gap-2">
                    {#if $isPillarSaving}
                        <div class="flex items-center gap-2">
                            <div class="h-6 w-6 animate-spin text-alineados-blue-900">
                                <Loading />
                            </div>
                            <span class="text-sm text-gray-600">Guardando...</span>
                        </div>
                    {:else}
                        <div class="flex items-center gap-2">
                            <Cloud styleTw="size-6 text-alineados-gray-400" />
                            <span class="text-sm text-gray-400">Guardado</span>
                        </div>
                    {/if}
                </div>
                
                <Lock class="size-4 text-alineados-gray-600" />
                <span class={`rounded-lg px-3 py-1 text-xs font-semibold ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {isActive ? 'Activo' : 'Inactivo'}
                </span>
                <button class="focus group flex items-center gap-[6px] rounded-lg px-4 py-3 text-white transition duration-300 ease-in-out hover:shadow-lg disabled:cursor-not-allowed {isActive ? 'bg-alineados-blue-900 hover:bg-alineados-blue-700' : 'bg-alineados-blue-500'}" disabled={!isActive}>
                    <CircleCheck styleTw="size-4" />
                    <span class="text-sm font-medium">Rendir Cuentas</span>
                </button>
                
                <a
                    href="/personal/pillars"
                    class="focus group flex items-center gap-1 rounded-lg bg-alineados-gray-100 px-4 py-3 text-alineados-blue-900 transition duration-300 ease-in-out hover:shadow-lg"
                >
                    <BackArrow class="size-4 font-bold text-alineados-blue-900" />
                    <p class="text-sm font-medium">Regresar</p>
                </a>
                
                <div class="relative">
                    <button 
                        class="rounded-full p-2 hover:bg-alineados-gray-100"
                        on:click={() => showMenu = !showMenu}
                    >
                        <ElipsisVertical styleTw="size-5" />
                    </button>
                    
                    {#if showMenu}
                        <div class="absolute right-0 top-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md mt-1">
                            <button
                                class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-alineados-gray-100 disabled:opacity-50"
                                on:click={() => { 
                                    updateCategoryState(!isActive); 
                                    showMenu = false; 
                                }}
                                disabled={isUpdatingState}
                            >
                                {#if isUpdatingState}
                                    <div class="mr-2 h-4 w-4 animate-spin">
                                        <Loading />
                                    </div>
                                    {isActive ? 'Desactivando...' : 'Activando...'}
                                {:else if isActive}
                                    <Blocked class="mr-2 size-4" />
                                    Desactivar
                                {:else}
                                    <Lock class="mr-2 size-4" />
                                    Activar
                                {/if}
                            </button>
                            
                            <button
                                class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-alineados-gray-100"
                                on:click={() => handleExport()}
                            >
                                <File class="mr-2 size-4" />
                                Exportar
                            </button>
                            
                            <button
                                class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-alineados-gray-100"
                                on:click={() => { isProtected = !isProtected; showMenu = false; }}
                            >
                                {#if isProtected}
                                    <Lock class="mr-2 size-4" />
                                    Desbloquear
                                {:else}
                                    <Lock class="mr-2 size-4" />
                                    Proteger
                                {/if}
                            </button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Click outside to close menu -->
{#if showMenu}
    <div class="fixed inset-0 z-40" on:click={() => showMenu = false}></div>
{/if}