<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowNumber from '$lib/components/ArrowNumber.svelte';
	import ViewCard from '$lib/components/ViewCard.svelte';
	import ViewProblemsFilter from '$lib/modules/dashboard/Problems/ViewProblemsFilter.svelte';
	import ViewCriteriaFilter from '$lib/modules/dashboard/Problems/ViewCriteriaFilter.svelte';
	import ViewTable from '$lib/modules/dashboard/Problems/ViewTable.svelte';
	import ArrowDown from '$lib/icons/ArrowDown.svelte';
	import ArrowUp from '$lib/icons/ArrowUp.svelte';
	import Hand from '$lib/icons/Hand.svelte';
	import ViewHeader from '$lib/modules/dashboard/Problems/ViewHeader.svelte';
	import ViewHeaderTable from '$lib/modules/dashboard/Problems/ViewHeaderTable.svelte';
	import type { PageData } from '../$types';

	// Sticker header
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
		filterContainerRef.style.top = `${headerHeight /*+ cardContainerHeight*/}px`;
		tableHeaderRef.style.top = `${headerHeight /*+ cardContainerHeight*/ + filterContainerHeight}px`;
		tableContainerRef.style.top = `${headerHeight /*+ cardContainerHeight*/ + filterContainerHeight + tableHeaderHeight}px`;
	});

	// get data from server.ts
	let { data }: { data: PageData } = $props();

	$inspect({ ...data.problems });

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
	let firstCriterion = $state('objectives');
	let secondCriterion = $state('action_plan');

	$inspect({ selectedProblem });
	//$inspect({ firstCriterion });
	//$inspect({ secondCriterion });

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

	<div bind:this={cardContainerRef} class="sticky -z-10 flex w-full gap-12 bg-white pb-12">
		<ViewCard contentClass="w-full">
			{#snippet content()}
				<div class="flex w-full items-center gap-3 p-6">
					<div class="rounded-xl bg-alineados-green-50 p-4">
						<Hand styleTw="size-9 text-alineados-green-900" />
					</div>
					<div>
						<p class="text-sm font-medium text-black">Total de Problemas</p>
						<p class="-mt-1 text-2xl font-semibold text-alineados-gray-800">242</p>
					</div>
				</div>
			{/snippet}
		</ViewCard>
		<ViewCard contentClass="w-full">
			{#snippet content()}
				<div class="flex w-full items-center justify-between gap-3 p-6">
					<div class="flex flex-col gap-3">
						<p class="text-sm font-medium text-black">Pilares con menos problemas</p>
						<div class="flex items-center gap-2">
							<div class="rounded-xl bg-alineados-green-50 p-2">
								<Hand styleTw="size-9 text-alineados-green-900" />
							</div>
							<div>
								<p class="text-xs font-medium text-alineados-gray-400">Pilar</p>
								<p class="-mt-1 text-xl font-medium text-alineados-gray-800">Salud</p>
							</div>
						</div>
					</div>
					<div class="flex h-full items-end">
						<ArrowNumber>
							{#snippet arrow()}
								<ArrowDown styleTw="size-6 text-[#FB5B5B]" strokeWidth={2} />
							{/snippet}
						</ArrowNumber>
					</div>
				</div>
			{/snippet}
		</ViewCard>
		<ViewCard contentClass="w-full">
			{#snippet content()}
				<div class="flex w-full items-center justify-between gap-3 p-6">
					<div class="flex flex-col gap-3">
						<p class="text-sm font-medium text-black">Pilares con más problemas</p>
						<div class="flex items-center gap-2">
							<div class="rounded-xl bg-alineados-green-50 p-2">
								<Hand styleTw="size-9 text-alineados-green-900" />
							</div>
							<div>
								<p class="text-xs font-medium text-alineados-gray-400">Pilar</p>
								<p class="-mt-1 text-2xl font-medium text-alineados-gray-800">Salud</p>
							</div>
						</div>
					</div>
					<div class="flex h-full items-end">
						<ArrowNumber>
							{#snippet arrow()}
								<ArrowUp styleTw="size-6 text-[#0FC917]" strokeWidth={2} />
							{/snippet}
						</ArrowNumber>
					</div>
				</div>
			{/snippet}
		</ViewCard>
	</div>

	<div bind:this={filterContainerRef} class="sticky z-10 flex w-full gap-12 bg-white pb-12">
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
		<ViewHeaderTable {firstCriterionLabel} {secondCriterionLabel} />
	</div>

	<div
		bind:this={tableContainerRef}
		class="z-10 w-full overflow-hidden overscroll-contain rounded-b-xl border border-alineados-gray-100 bg-white"
	>
		<ViewTable />
	</div>
</div>
