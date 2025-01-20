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
</script>

<div class="sticky top-0 z-10 w-full bg-white px-4 md:px-8 lg:px-16">
	<PillarHeader />
</div>

<div class="flex flex-col gap-12 px-4 md:px-8 lg:px-16">
	<ProblemCard title="Salud" bind:problems={$healthProblemsFiltered} />
	<ProblemCard title="Relación" bind:problems={$relationalProblemsFiltered} />
	<ProblemCard title="Vocación" bind:problems={$vocationalProblemsFiltered} />
	<ProblemCard title="Espiritual" bind:problems={$spiritualProblemsFiltered} />
</div>
