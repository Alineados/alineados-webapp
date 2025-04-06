<script lang="ts">
	import type { PageData } from './$types';
	import PillarHeader from '$lib/modules/dashboard/Problems/PillarHeader.svelte';
	import ProblemCard from '$lib/modules/dashboard/Problems/ProblemCard.svelte';
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
</script>

<div class="w-full bg-white px-4 md:px-8 lg:px-16">
    <div class="max-w-7xl">
        <PillarHeader {data} />
    </div>
</div>

<div class="flex flex-col gap-12 px-4 md:px-8 lg:px-16">
	<ProblemCard title="Salud" problems={reversedHealth} />
	<ProblemCard title="Relación" problems={reversedRelational} />
	<ProblemCard title="Vocación" problems={reversedVocational} />
	<ProblemCard title="Espiritual" problems={reversedSpiritual} />
</div>
