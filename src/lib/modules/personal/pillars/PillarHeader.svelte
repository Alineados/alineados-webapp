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
    import { isPillarSaving, currentCategoryInfo } from '$lib/stores/pillar/category';
    import { exportPillarToPDF } from '$lib/utils/exportPillar';
    import { page } from '$app/stores';
    import { userState } from '$lib/stores';
    import { getContext } from 'svelte';

    let { 
        pillarInfo,
        category 
    }: { 
        pillarInfo: DataPillar;
        category: string;
    } = $props();
    
    let isActive = $state(true);
    let isProtected = $state(false);
    let showMenu = $state(false);
    let isExporting = $state(false);

    // Obtener el token del contexto
    const token = getContext<string>('token');
    
    // Obtener parámetros de la URL
    let pillar = $derived($page.params.pillar);
    let categoryId = $derived($page.data?.categoryData?.id || '');

    // Función para exportar a PDF
    function handleExport() {
        const categoryData = $page.data?.categoryData;
        const globalCategoryInfo = $currentCategoryInfo;
        
        if (!categoryData) {
            console.error('No category data available');
            return;
        }

        isExporting = true;
        
        try {
            // Convertir los datos al formato correcto para exportación
            const exportCategoryInfo = {
                cid: globalCategoryInfo?.cid || categoryId,
                uid: globalCategoryInfo?.uid || userState.id || '',
                is_current: globalCategoryInfo?.is_current || true,
                elements: globalCategoryInfo?.elements?.map((item: any) => ({
                    description: item.description,
                    prominent: item.favorite,
                    daily: item.repeated
                })) || [],
                objectives: globalCategoryInfo?.objectives?.map((item: any) => ({
                    description: item.description,
                    prominent: item.favorite,
                    daily: item.repeated
                })) || [],
                positive_actions: globalCategoryInfo?.positive_actions?.map((item: any) => ({
                    description: item.description,
                    prominent: item.favorite,
                    daily: item.repeated
                })) || [],
                improve_actions: globalCategoryInfo?.improve_actions?.map((item: any) => ({
                    description: item.description,
                    prominent: item.favorite,
                    daily: item.repeated
                })) || [],
                habits: globalCategoryInfo?.habits?.map((item: any) => ({
                    description: item.description,
                    prominent: item.favorite,
                    daily: item.repeated
                })) || [],
                short_actions: globalCategoryInfo?.short_actions?.map((item: any) => ({
                    description: item.description,
                    prominent: item.favorite,
                    daily: item.repeated
                })) || [],
                middle_actions: globalCategoryInfo?.middle_actions?.map((item: any) => ({
                    description: item.description,
                    prominent: item.favorite,
                    daily: item.repeated
                })) || [],
                long_actions: globalCategoryInfo?.long_actions?.map((item: any) => ({
                    description: item.description,
                    prominent: item.favorite,
                    daily: item.repeated
                })) || []
            };

            exportPillarToPDF({
                categoryName: category,
                categoryInfo: exportCategoryInfo,
                pillarType: pillar,
                categoryData: {
                    priority: categoryData.priority,
                    state: categoryData.state,
                    active: categoryData.active
                }
            });
            
            console.log('Category exported successfully');
        } catch (error) {
            console.error('Error exporting category:', error);
        } finally {
            isExporting = false;
        }
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

                <!-- Botón Regresar -->
                <a 
                    href="/personal/pillars" 
                    class="group flex items-center gap-[6px] rounded-lg bg-alineados-gray-100 px-4 py-3 text-alineados-blue-900 transition duration-300 ease-in-out hover:shadow-lg"
                >
                    <BackArrow class="size-4" />
                    <span class="text-sm font-medium">Regresar</span>
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
                                class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-alineados-gray-100"
                                on:click={() => { isActive = !isActive; showMenu = false; }}
                            >
                                {#if isActive}
                                    <Blocked class="mr-2 size-4" />
                                    Desactivar
                                {:else}
                                    <Lock class="mr-2 size-4" />
                                    Activar
                                {/if}
                            </button>
                            
                            <button
                                class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-alineados-gray-100"
                                on:click={() => { handleExport(); showMenu = false; }}
                                disabled={isExporting}
                            >
                                {#if isExporting}
                                    <div class="mr-2 h-4 w-4 animate-spin">
                                        <Loading />
                                    </div>
                                    Generando PDF...
                                {:else}
                                    <File class="mr-2 size-4" />
                                    Exportar
                                {/if}
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