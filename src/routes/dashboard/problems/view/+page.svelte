<script lang="ts">
	import { onMount } from 'svelte';

	import ViewHeader from '$lib/modules/dashboard/Problems/ViewHeader.svelte';
	import ViewStatistics from '$lib/modules/dashboard/Problems/ViewStatistics.svelte';
	import ViewProblemsFilter from '$lib/modules/dashboard/Problems/ViewProblemsFilter.svelte';
	import ViewCriteriaFilter from '$lib/modules/dashboard/Problems/ViewCriteriaFilter.svelte';
	import ViewTable from '$lib/modules/dashboard/Problems/ViewTable.svelte';
	import ViewTableHeader from '$lib/modules/dashboard/Problems/ViewTableHeader.svelte';
	import type { PageData } from '../$types';

	// Sitcky references for positioning
	let headerRef: HTMLElement;
	let cardContainerRef: HTMLElement;
	let filterContainerRef: HTMLElement;
	let tableHeaderRef: HTMLElement;
	let tableContainerRef: HTMLElement;

	onMount(() => {
		const headerHeight = headerRef.offsetHeight;
		const cardContainerHeight = cardContainerRef.offsetHeight;
		const filterContainerHeight = filterContainerRef.offsetHeight;
		const tableHeaderHeight = tableHeaderRef.offsetHeight;

		cardContainerRef.style.top = `${headerHeight}px`;
		filterContainerRef.style.top = `${headerHeight + cardContainerHeight}px`;
		tableHeaderRef.style.top = `${headerHeight + cardContainerHeight + filterContainerHeight}px`;
		tableContainerRef.style.top = `${headerHeight + cardContainerHeight + filterContainerHeight + tableHeaderHeight}px`;
	});

	// get data from server.ts
	let { data }: { data: PageData } = $props();
	//$inspect({ ...data.problems });

	// Criteria options
	const criteriaOptions = [
		{ criterion: 'decision_taken', label: 'Tomador de Decisión' },
		{ criterion: 'involved', label: 'Involucrados' },
		{ criterion: 'contexts', label: 'Contexto' },
		{ criterion: 'problem', label: 'Problema' },
		{ criterion: 'objectives', label: 'Objetivos' },
		{ criterion: 'alternatives', label: 'Alternativas' },
		{ criterion: 'recommended_decision', label: 'Decisión Recomendada' },
		{ criterion: 'final_decision', label: 'Decisión Final' },
		{ criterion: 'action_plan', label: 'Plan de Acción' }
	];

	// States
	let selectedProblem = $state('all');
	let firstCriterion = $state('problem');
	let secondCriterion = $state('action_plan');
	//$inspect({ selectedProblem });
	//$inspect({ firstCriterion });
	//$inspect({ secondCriterion });

	// Get labels for criteria
	const firstCriterionLabel = $derived(
		firstCriterion
			? criteriaOptions.find((opt) => opt.criterion === firstCriterion)?.label || ''
			: ''
	);

	const secondCriterionLabel = $derived(
		secondCriterion
			? criteriaOptions.find((opt) => opt.criterion === secondCriterion)?.label || ''
			: ''
	);
</script>

<div class="relative h-full">
	<div bind:this={headerRef} class="sticky top-0 z-10 w-full bg-white">
		<ViewHeader />
	</div>

	<div bind:this={cardContainerRef} class="sticky z-10 flex w-full gap-12 bg-white pb-12">
		<ViewStatistics {...data.problems} />
	</div>

	<div
		bind:this={filterContainerRef}
		class="sticky z-10 grid w-full bg-white pb-12"
		style="grid-template-columns: 2fr 3fr 3fr;"
	>
		<ViewProblemsFilter name="pillars" {...data.problems} bind:value={selectedProblem} />
		<ViewCriteriaFilter
			name="first_criterion"
			criteria={criteriaOptions}
			bind:value={firstCriterion}
		/>
		<ViewCriteriaFilter
			name="second_criterion"
			criteria={criteriaOptions}
			bind:value={secondCriterion}
		/>
	</div>

	<div bind:this={tableHeaderRef} class="sticky z-10 bg-white">
		<ViewTableHeader {firstCriterionLabel} {secondCriterionLabel} />
	</div>

	<div
		bind:this={tableContainerRef}
		class="z-10 w-full overflow-hidden overscroll-contain rounded-b-xl border border-alineados-gray-100 bg-white"
	>
		<ViewTable {...data.problems} {selectedProblem} {firstCriterion} {secondCriterion} />
	</div>
</div>
