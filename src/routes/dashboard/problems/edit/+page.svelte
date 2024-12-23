<script lang="ts">
	import { onMount } from 'svelte';
	import ProblemBody from '$lib/modules/dashboard/Problems/ProblemBody.svelte';
	import ProblemHeader from '$lib/modules/dashboard/Problems/ProblemHeader.svelte';
	import ProblemsFilter from '$lib/modules/dashboard/Problems/ProblemsFilter.svelte';
	import AsideProblem from '$lib/modules/dashboard/Problems/AsideProblem.svelte';
	import {
		initMatrix,
		initProblemCard,
		initProblemInfo,
		pid,
		problemCard,
		reportProblem
	} from '$lib/stores';
	import AccountabilityBody from '$lib/modules/dashboard/Problems/AccountabilityBody.svelte';
	import DateDialog from '$lib/components/DateDialog.svelte';

	// get data from server.ts
	let { data }: { data: any } = $props();

	$effect(() => {
		initProblemInfo({ ...data.problemInfo });
		initProblemCard({ ...data.problemCard });
		initMatrix({ ...data.problemMatrix });
	});

	let headerRef = $state<HTMLElement>();
	let problemsFilterRef = $state<HTMLElement>();
	let accountabilityBodyRef = $state<HTMLElement>();
	let asideProblemRef = $state<HTMLElement>();
	let date = $state('');
	let closeDialog = $state(false);

	// function
	function handleDate() {
		closeDialog = true;

		$problemCard.milestone_date = date;

		// reset date
		date = '';
	}

	onMount(() => {
		initProblemInfo({ ...data.problemInfo });
		initProblemCard({ ...data.problemCard });
		initMatrix({ ...data.problemMatrix });
		$reportProblem = 1;

		const headerHeight = headerRef ? headerRef.offsetHeight : 0;
		const problemsFilterHeight = problemsFilterRef ? problemsFilterRef.offsetHeight : 0;

		if (problemsFilterRef) problemsFilterRef.style.top = `${headerHeight}px`;
		if (asideProblemRef) asideProblemRef.style.top = `${headerHeight}px`;

		if (accountabilityBodyRef)
			accountabilityBodyRef.style.top = `${headerHeight + problemsFilterHeight}px`;
	});
</script>

{#if !$problemCard}
	<p>Loading...</p>
{:else}
	<div bind:this={headerRef} class="sticky top-0 z-10 bg-white">
		<ProblemHeader bind:title={$problemCard.problem_name} />
	</div>

	<div class="flex w-full items-start">
		<div class=" flex w-7/12 flex-col">
			{#if $reportProblem !== 2}
				<div bind:this={problemsFilterRef} class="sticky top-32 z-10 bg-white">
					<ProblemsFilter pid={$pid} pillar_name={data.pillar_name} />
				</div>
			{/if}

			<div bind:this={accountabilityBodyRef}>
				{#if $reportProblem === 2}
					<AccountabilityBody />
				{:else}
					<ProblemBody />
				{/if}
			</div>
		</div>

		<div bind:this={asideProblemRef} class="sticky top-32 z-10 flex w-5/12 justify-end">
			<AsideProblem />
		</div>
	</div>
	<div class="flex">
		<DateDialog open={$problemCard.is_new && !closeDialog} bind:date confirm={handleDate} />
	</div>
{/if}
