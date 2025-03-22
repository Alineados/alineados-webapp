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
</script>

<div class="sticky top-0 z-10 w-full bg-white px-4 md:px-8 lg:px-16">
	<PillarHeader />
</div>

<div class="flex flex-col gap-12 px-4 md:px-8 lg:px-16">
	<ProblemCard title="Salud" problems={reversedHealth} />
	<ProblemCard title="Relación" problems={reversedRelational} />
	<ProblemCard title="Vocación" problems={reversedVocational} />
	<ProblemCard title="Espiritual" problems={reversedSpiritual} />
</div>
