<script lang="ts">
    import CardFilter from '$lib/components/CardFilter.svelte';
    import NewProblemButton from '$lib/components/NewProblemButton.svelte';
    import ViewButtonActions from '$lib/components/ViewButtonActions.svelte';
    import { filterBy } from '$lib/stores/pillar/card';
    import { goto } from '$app/navigation';
    
    // Estado local para los filtros
    let cardFilter = {
        all: true,
        active: false,
        inactive: false
    };

    function changeFilter(filter: keyof typeof cardFilter) {
        cardFilter.all = false;
        cardFilter.active = false;
        cardFilter.inactive = false;

        cardFilter[filter] = true;
        filterBy.set(filter);
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
        <span class="text-alineados-orange-900">Mis Pilares de Vida</span>
    </p>
    <div class="flex flex-col gap-5 border-b border-alineados-gray-200 pb-6 lg:flex-row lg:justify-between">
        <p class="text-5xl font-bold text-alineados-blue-900">Mis Pilares de Vida</p>
        <div class="flex flex-row gap-4 self-start">
            <NewProblemButton />
            <ViewButtonActions />
        </div>
    </div>
</div>

<div class="flex flex-row gap-2 pb-6">
    <CardFilter type="simple" text="Todas" bind:selected={cardFilter.all} triggerFunction={() => changeFilter('all')} />
    <CardFilter type="simple" text="Activas" bind:selected={cardFilter.active} triggerFunction={() => changeFilter('active')} />
    <CardFilter type="simple" text="No Activas" bind:selected={cardFilter.inactive} triggerFunction={() => changeFilter('inactive')} />
</div>
