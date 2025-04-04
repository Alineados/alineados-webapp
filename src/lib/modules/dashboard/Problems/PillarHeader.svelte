<script lang="ts">
	import CardFilter from '$lib/components/CardFilter.svelte';
	import NewProblemButton from '$lib/components/NewProblemButton.svelte';
	import ViewButton from '$lib/components/ViewButton.svelte';
	import MoreButtonProblems from '$lib/components/MoreButtonProblems.svelte';
	import { filterBy } from '$lib/stores';

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

<div>
    <!-- Fixed header section -->
    <div class="fixed top-0 left-[255px] right-0 z-40 bg-white">
        <div class="px-4 md:px-8 lg:px-16">
            <div class="flex flex-col gap-4">
                <p class="flex flex-row text-sm font-medium text-alineados-gray-600 ">Situaciones por Mejorar</p>
                <div class="flex flex-col gap-4 border-b pb-4 border-alineados-gray-200 lg:flex-row lg:justify-between">
                    <p class="text-5xl font-bold text-alineados-blue-900">Situaciones por Mejorar</p>
                    <div class="flex flex-row gap-4 self-start">
                        <NewProblemButton />
                        <ViewButton />
                        <MoreButtonProblems />
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    <div class="h-24"></div>

    <!-- Scrollable filters section -->
    <div class="flex flex-row gap-2 pb-6 mt-2">
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
</div>
