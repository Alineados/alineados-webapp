<script lang="ts">
	import type { PageData } from './$types';
	import type { PillarItems } from '$lib/interfaces';
	import PillarHeader from '$lib/modules/dashboard/Problems/PillarHeader.svelte';
	import ProblemCard from '$lib/modules/dashboard/Problems/ProblemCard.svelte';
	import { initProblems } from '$lib/stores';
	import {
		healthProblems,
		relationalProblems,
		spiritualProblems,
		vocationalProblems
	} from '$lib/stores';
	// get data from server.ts
	let { data }: { data: PageData } = $props();


	// init stores
	initProblems({ ...data.problems });

	function handleSelectedPillar(item: PillarItems) {
		console.log('Selected from parent	 -> ', item);
	}
</script>

<div class="sticky top-0 z-10 w-full bg-white">
	<PillarHeader {handleSelectedPillar} />
</div>

<div class="flex flex-col gap-12 pb-12">
	<ProblemCard title="Salud"  problems={$healthProblems} />
	<ProblemCard title="Relación"  problems={$relationalProblems} />
	<ProblemCard title="Vocación"  problems={$vocationalProblems} />
	<ProblemCard title="Espiritual"  problems={$spiritualProblems} />
</div>
