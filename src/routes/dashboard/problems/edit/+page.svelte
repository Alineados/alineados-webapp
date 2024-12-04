<script lang="ts">
	import { onMount } from 'svelte';
	import ProblemBody from '$lib/modules/dashboard/Problems/ProblemBody.svelte';
	import ProblemHeader from '$lib/modules/dashboard/Problems/ProblemHeader.svelte';
	import ProblemsFilter from '$lib/modules/dashboard/Problems/ProblemsFilter.svelte';
	import AsideProblem from '$lib/modules/dashboard/Problems/AsideProblem.svelte';
	import { initProblemCard, initProblemInfo, pid, problemCard } from '$lib/stores';

	// get data from server.ts
	let { data }: { data: any } = $props();
	// init stores
	$effect(() => {
		initProblemInfo({ ...data.problemInfo });
		initProblemCard({ ...data.problemCard });
	});

	let headerRef: HTMLElement;
	let problemsFilterRef: HTMLElement;
	let accountabilityBodyRef: HTMLElement;
	let asideProblemRef: HTMLElement;

	onMount(() => {
		const headerHeight = headerRef.offsetHeight;
		const problemsFilterHeight = problemsFilterRef.offsetHeight;

		problemsFilterRef.style.top = `${headerHeight}px`;
		asideProblemRef.style.top = `${headerHeight}px`;
		accountabilityBodyRef.style.top = `${headerHeight + problemsFilterHeight}px`;
	});
</script>

<div bind:this={headerRef} class="sticky top-0 z-10 bg-white">
	<ProblemHeader bind:title={$problemCard.problem_name} />
</div>

<div class="flex w-full items-start">
	<div class=" flex w-7/12 flex-col">
		<div bind:this={problemsFilterRef} class="sticky top-32 z-10 bg-white">
			<ProblemsFilter pid={$pid} pillar_name={data.pillar_name} />
		</div>

		<div bind:this={accountabilityBodyRef} >
			<ProblemBody />
		</div>
	</div>

	<div bind:this={asideProblemRef} class="sticky top-32 z-10 flex w-5/12 justify-center bg-white">
		<AsideProblem />
	</div>
</div>
