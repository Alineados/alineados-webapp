<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import RelationCard from '$lib/components/Relations/RelationCard.svelte';
    import GatheringModal from '$lib/components/Relations/GatheringModal.svelte';
    import { 
        relations, 
        areas, 
        relationsFiltered,
        searchTerm,
        selectedAreaId,
        filterISeekThem,
        filterTheySeekMe,
        filterStatus,
        includeArchived,
        sortBy,
        isLoading,
        totalRelations,
        clearFilters
    } from '$lib/stores/relations/relations';
    import type { RelationsListRequest, RelationListItem, Area } from '$lib/interfaces/Relations.interface';
    import type { PageData } from './$types.js';

    let { data }: { data: PageData } = $props();
    
    // Iconos
    import Search from 'lucide-svelte/icons/search';
    import Plus from 'lucide-svelte/icons/plus';
    import Users from 'lucide-svelte/icons/users';
    import Filter from 'lucide-svelte/icons/filter';

    // Tabs para filtros rápidos
    const tabs = [
        { key: 'all', label: 'Todos', filter: {} },
        { key: 'i_seek', label: 'Yo a ellos', filter: { i_seek_them: true } },
        { key: 'they_seek', label: 'Ellos a mi', filter: { they_seek_me: true } },
        { key: 'archived', label: 'Archivados', filter: { include_archived: true } },
    ];

    let activeTab = $state('all');
    let showFilters = $state(false);

    // Función para cargar datos del servidor
    function loadData() {
        console.log('🔍 Relations Home - Loading data from server:', data);
        
        // Set relations and areas from server data
        relations.set(data.relations || []);
        areas.set(data.areas || []);
        totalRelations.set(data.relations?.length || 0);
        
        console.log('✅ Relations Home - Data loaded:', {
            relations: data.relations?.length || 0,
            areas: data.areas?.length || 0
        });
    }

    // Función para aplicar filtro de tab
    function setActiveTab(tab: typeof tabs[0]) {
        activeTab = tab.key;
        
        // Limpiar filtros previos
        filterISeekThem.set(null);
        filterTheySeekMe.set(null);
        filterStatus.set('');
        includeArchived.set(false);
        
        // Aplicar filtros del tab
        if (tab.filter.i_seek_them !== undefined) {
            filterISeekThem.set(tab.filter.i_seek_them);
        }
        if (tab.filter.they_seek_me !== undefined) {
            filterTheySeekMe.set(tab.filter.they_seek_me);
        }
        if ((tab.filter as any).status) {
            filterStatus.set((tab.filter as any).status);
        }
        if (tab.filter.include_archived !== undefined) {
            includeArchived.set(tab.filter.include_archived);
        }
    }

    function handleNewRelation() {
        goto('/relations/new');
    }

    let openGathering = $state(false);
    function handleNewEncounter() { openGathering = true; }

    // Cargar datos al montar el componente
    onMount(() => {
        loadData();
    });
</script>

<div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
        <div>
            <p class="mb-2 text-sm font-medium text-alineados-gray-600">Relaciones</p>
            <h1 class="text-5xl font-bold text-alineados-gray-900">Relaciones</h1>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-3">
            <button
                class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                onclick={handleNewEncounter}
            >
                <Plus class="h-4 w-4" />
                Nuevo Encuentro
            </button>
            <button
                class="flex items-center gap-2 rounded-lg bg-alineados-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-alineados-green-700"
                onclick={handleNewRelation}
            >
                <Plus class="h-4 w-4" />
                Nueva Relación
            </button>
        </div>
    </div>

    <!-- Summary Stats -->
    <div class="mb-8 flex items-center gap-6">
        <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <div class="rounded-xl bg-alineados-green-100 p-3">
                <Users class="h-6 w-6 text-alineados-green-600" />
            </div>
            <div>
                <p class="text-sm text-gray-600">Total Relaciones</p>
                <p class="text-2xl font-semibold">{$totalRelations}</p>
            </div>
        </div>
        
        <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <div class="rounded-xl bg-alineados-green-100 p-3">
                <Filter class="h-6 w-6 text-alineados-green-600" />
            </div>
            <div>
                <p class="text-sm text-gray-600">Filtradas</p>
                <p class="text-2xl font-semibold">{$relationsFiltered.length}</p>
            </div>
        </div>
    </div>

    <!-- Search and Filters -->
    <div class="mb-8 space-y-4">
        <!-- Search Bar -->
        <div class="relative">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Buscar relaciones..."
                class="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:border-alineados-green-500 focus:outline-none focus:ring-2 focus:ring-alineados-green-200"
                bind:value={$searchTerm}
            />
        </div>

        <!-- Filter Tabs -->
        <div class="flex gap-2 flex-wrap">
            {#each tabs as tab}
                <button 
                    class="rounded-full px-4 py-2 text-sm font-medium transition-colors {activeTab === tab.key ? 'bg-alineados-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                    onclick={() => setActiveTab(tab)}
                >
                    {tab.label}
                </button>
            {/each}
        </div>

        <!-- Advanced Filters -->
        <div class="flex gap-4 flex-wrap">
            <!-- Area Filter -->
            <select 
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-alineados-green-500 focus:outline-none focus:ring-2 focus:ring-alineados-green-200"
                bind:value={$selectedAreaId}
            >
                <option value="">Todas las áreas</option>
                {#each $areas as area}
                    <option value={area.id}>{area.name}</option>
                {/each}
            </select>

            <!-- Status Filter -->
            <select 
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-alineados-green-500 focus:outline-none focus:ring-2 focus:ring-alineados-green-200"
                bind:value={$filterStatus}
            >
                <option value="">Todos los estados</option>
                <option value="bien">Bien</option>
                <option value="normal">Normal</option>
                <option value="mal">Mal</option>
            </select>

            <!-- Sort -->
            <select 
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-alineados-green-500 focus:outline-none focus:ring-2 focus:ring-alineados-green-200"
                bind:value={$sortBy}
            >
                <option value="updated_desc">Más recientes</option>
                <option value="name_asc">Nombre A-Z</option>
                <option value="name_desc">Nombre Z-A</option>
                <option value="created_desc">Más nuevos</option>
                <option value="created_asc">Más antiguos</option>
            </select>
        </div>
    </div>

    <!-- Relations Grid -->
    {#if $isLoading}
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-alineados-green-600"></div>
            <span class="ml-3 text-gray-600">Cargando relaciones...</span>
        </div>
    {:else if $relationsFiltered.length === 0}
        <div class="flex flex-col items-center justify-center py-12">
            <Users class="h-16 w-16 text-gray-400 mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No hay relaciones</h3>
            <p class="text-gray-600 mb-4">
                {$searchTerm || $selectedAreaId || $filterStatus ? 'No se encontraron relaciones con los filtros aplicados.' : 'Comienza agregando tu primera relación.'}
            </p>
            {#if !$searchTerm && !$selectedAreaId && !$filterStatus}
                <button
                    class="flex items-center gap-2 rounded-lg bg-alineados-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-alineados-green-700"
                    onclick={handleNewRelation}
                >
                    <Plus class="h-4 w-4" />
                    Crear primera relación
                </button>
            {/if}
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {#each $relationsFiltered as relation (relation.id)}
                <RelationCard {relation} />
            {/each}
        </div>
    {/if}

    <GatheringModal open={openGathering} relations={$relationsFiltered} on:close={() => openGathering = false} />
</div>