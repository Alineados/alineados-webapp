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

	// get data from server.ts
	let { data }: { data: PageData } = $props();

	// init stores
	$effect(() => {
		initProblems({ ...data.problems });
	});
</script>

<div class="sticky top-0 z-10 w-full bg-white">
	<PillarHeader />
</div>

<div class="flex flex-col gap-12">
	<ProblemCard title="Salud" problems={$healthProblemsFiltered} />
	<ProblemCard title="Relación" problems={$relationalProblemsFiltered} />
	<ProblemCard title="Vocación" problems={$vocationalProblemsFiltered} />
	<ProblemCard title="Espiritual" problems={$spiritualProblemsFiltered} />
</div>
