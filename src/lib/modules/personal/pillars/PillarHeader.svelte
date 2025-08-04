<script lang="ts">
    import Lock from '$lib/icons/Lock.svelte';
    import Eye from '$lib/icons/Eye.svelte';
    import ElipsisVertical from '$lib/icons/ElipsisVertical.svelte';
    import Blocked from '$lib/icons/Blocked.svelte';
    import File from '$lib/icons/File.svelte';
    import CircleCheck from '$lib/icons/CircleCheck.svelte';
    import Cloud from '$lib/icons/Cloud.svelte';
    import Loading from '$lib/icons/Loading.svelte';
    import type { DataPillar } from '$lib/interfaces';
    import { isPillarSaving } from '$lib/stores/pillar/category';

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
                                on:click={() => showMenu = false}
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