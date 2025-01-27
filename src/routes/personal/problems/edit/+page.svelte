<script lang="ts">
	import { onMount } from 'svelte';
	import ProblemBody from '$lib/modules/dashboard/Problems/ProblemBody.svelte';
	import ProblemHeader from '$lib/modules/dashboard/Problems/ProblemHeader.svelte';
	import ProblemsFilter from '$lib/modules/dashboard/Problems/ProblemsFilter.svelte';
	import AsideProblem from '$lib/modules/dashboard/Problems/AsideProblem.svelte';
	import {
	initImages,
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
		initImages(data.urlImages);
	});

	let headerRef = $state<HTMLElement>();
	let problemsFilterRef = $state<HTMLElement>();
	let accountabilityBodyRef = $state<HTMLElement>();
	let asideProblemRef = $state<HTMLElement>();
	let date = $state('');
	let closeDialog = $state(false);
	let openDateModal = $state(false);

	$effect(() => {
		openDateModal = $problemCard.is_new && !closeDialog;
	});

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
		initImages(data.urlImages);

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
	<div bind:this={headerRef} class="sticky top-0 z-20 bg-white">
		<ProblemHeader bind:title={$problemCard.problem_name} />
	</div>

	<div class="flex w-full items-start">
		<div class=" flex w-8/12 flex-col">
			{#if $reportProblem !== 2}
				<div bind:this={problemsFilterRef} class="sticky z-20 bg-white">
					<ProblemsFilter pid={$pid} pillar_name={data.pillar_name} />
				</div>
			{/if}

			<div class="pl-4 md:pl-8 lg:pl-16" bind:this={accountabilityBodyRef}>
				{#if $reportProblem === 2}
					<AccountabilityBody />
				{:else}
					<ProblemBody />
				{/if}
			</div>
		</div>
		<div
			bind:this={asideProblemRef}
			class="sticky z-10 flex w-6/12 justify-end pr-4 pt-4 md:pr-8 lg:pr-16"
		>
			<AsideProblem bind:openDateModal />
		
		</div>
	</div>
	<div class="flex">
		<DateDialog bind:open={openDateModal} bind:date confirm={handleDate} />
	</div>
{/if}
