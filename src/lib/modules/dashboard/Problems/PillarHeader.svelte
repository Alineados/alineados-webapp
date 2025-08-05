<script lang="ts">
    import type { PageData } from '../../../../routes/$types';
    import CardFilter from '$lib/components/CardFilter.svelte';
    import NewProblemButton from '$lib/components/NewProblemButton.svelte';
    import ViewButton from '$lib/components/ViewButton.svelte';
    import MoreButtonProblems from '$lib/components/MoreButtonProblems.svelte';
    import { filterBy } from '$lib/stores';
    import ViewStatistics from '$lib/modules/dashboard/Problems/ViewStatistics.svelte';
    import {
        relationalProblemsFiltered,
        spiritualProblemsFiltered,
        vocationalProblemsFiltered,
        healthProblemsFiltered
    } from '$lib/stores';

    let { data }: { data: PageData } = $props();

    const reversedHealth = $derived([...$healthProblemsFiltered].reverse());
    const reversedRelational = $derived([...$relationalProblemsFiltered].reverse());
    const reversedVocational = $derived([...$vocationalProblemsFiltered].reverse());
    const reversedSpiritual = $derived([...$spiritualProblemsFiltered].reverse());

    // Filter items object state
    let cardFilter = $state<{ all: boolean; active: boolean; inactive: boolean; finished: boolean }>({
        all: true,
        active: false,
        inactive: false,
        finished: false
    });

    function changeFilter(filter: keyof typeof cardFilter) {
        cardFilter.all = false;
        cardFilter.active = false;
        cardFilter.inactive = false;
        cardFilter.finished = false;

        cardFilter[filter] = true;

        filterBy.set(filter);
    }
</script>

<div class="flex flex-col gap-6 pb-6">
    <!-- <div>
        <button class="text-alineados-gray-600 hover:underline">
            Personal
        </button>
        <span class="mx-1">/</span>
        <p class="flex flex-row text-sm font-medium text-alineados-gray-600">Situaciones por Mejorar</p>
    </div> -->
    <p class="flex flex-row text-sm font-medium text-alineados-gray-600">
		<button class="text-alineados-gray-600 hover:underline">
			Personal
		</button>
		<span class="mx-1">/</span>
		<button class="text-alineados-orange-900 hover:underline ">
			Situaciones por Mejorar
		</button>
	</p>
    <div class="flex flex-col gap-5 border-b border-alineados-gray-200 pb-6 lg:flex-row lg:justify-between">
        
        <p class="text-5xl font-bold text-alineados-blue-900">Situaciones por Mejorar</p>
        <div class="flex flex-row gap-4 self-start">
            <ViewButton />
            <NewProblemButton />
            <MoreButtonProblems />
        </div>
    </div>
</div>

<div class="flex justify-center bg-white pb-3">
    <div class="max-w-[2000px] w-full px-4 md:px-8 lg:px-16">
        <div class="grid grid-cols-3 gap-4">
            <ViewStatistics 
                total={data.problems.total}
                health={data.problems.health}
                relational={data.problems.relational}
                vocational={data.problems.vocational}
                spiritual={data.problems.spiritual}
                pilars={[
                    { pilar_name: 'Salud', key: 'health', problems: reversedHealth },
                    { pilar_name: 'Relación', key: 'relational', problems: reversedRelational },
                    { pilar_name: 'Vocación', key: 'vocational', problems: reversedVocational },
                    { pilar_name: 'Espiritual', key: 'spiritual', problems: reversedSpiritual }
                ]}
            />
        </div>
    </div>
</div>

<div class="flex flex-row gap-2 pb-6 mt-4">
    <CardFilter
        type="simple"
        text="Todas"
        bind:selected={cardFilter.all}
        triggerFunction={() => {
            changeFilter('all');
        }}
    />
    <CardFilter
        type="simple"
        text="Activas"
        bind:selected={cardFilter.active}
        triggerFunction={() => {
            changeFilter('active');
        }}
    />
    <CardFilter
        type="simple"
        text="No Activas"
        bind:selected={cardFilter.inactive}
        triggerFunction={() => {
            changeFilter('inactive');
        }}
    />
    <CardFilter
        type="simple"
        text="Concluidas"
        bind:selected={cardFilter.finished}
        triggerFunction={() => {
            changeFilter('finished');
        }}
    />
</div>
