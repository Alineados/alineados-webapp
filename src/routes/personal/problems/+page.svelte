<script lang="ts">
	import type { PageData } from './$types';
	import PillarHeader from '$lib/modules/dashboard/Problems/PillarHeader.svelte';
	import ProblemCard from '$lib/modules/dashboard/Problems/ProblemCard.svelte';
	import { initProblems } from '$lib/stores';
	import {
		relationalProblemsFiltered,
		spiritualProblemsFiltered,
		vocationalProblemsFiltered,
		healthProblemsFiltered
	} from '$lib/stores';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
    import ViewStatistics from '$lib/modules/dashboard/Problems/ViewStatistics.svelte';

	// get data from server.ts
	let { data }: { data: PageData } = $props();

	// init stores
	$effect(() => {
		initProblems({ ...data.problems });
	});

	onMount(() => {
		invalidateAll();
	});

const reversedHealth = $derived([...$healthProblemsFiltered].reverse());
const reversedRelational = $derived([...$relationalProblemsFiltered].reverse());
const reversedVocational = $derived([...$vocationalProblemsFiltered].reverse());
const reversedSpiritual = $derived([...$spiritualProblemsFiltered].reverse());
    let cardContainerRef: HTMLElement;
</script>

<!-- Remove sticky from parent container -->
<div class="w-full bg-white px-4 md:px-8 lg:px-16">
    <div class="max-w-7xl">
        <PillarHeader />
    </div>
</div>

<div bind:this={cardContainerRef} class="flex w-full gap-6 max-w-7xl bg-white pb-5 px-4 md:px-8 lg:px-16">
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

<div class="flex flex-col gap-12 px-4 md:px-8 lg:px-16">
	<ProblemCard title="Salud" problems={reversedHealth} />
	<ProblemCard title="Relación" problems={reversedRelational} />
	<ProblemCard title="Vocación" problems={reversedVocational} />
	<ProblemCard title="Espiritual" problems={reversedSpiritual} />
</div>
