<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowNumber from '$lib/components/ArrowNumber.svelte';
	import ViewCard from '$lib/components/ViewCard.svelte';
	import ViewFilterSelect from '$lib/components/ViewFilterSelect.svelte';
	import ViewTable from '$lib/components/ViewTable.svelte';
	import ArrowDown from '$lib/icons/ArrowDown.svelte';
	import ArrowUp from '$lib/icons/ArrowUp.svelte';
	import Hand from '$lib/icons/Hand.svelte';
	import ViewHeader from '$lib/modules/dashboard/Problems/ViewHeader.svelte';
	import ViewHeaderTable from '$lib/components/ViewHeaderTable.svelte';

	const problemsOptions = [
		{
			category: 'health',
			label: 'Salud',
			items: [
				{ id: 'uno', label: 'Uno' },
				{ id: 'dos', label: 'Dos' },
				{ id: 'tres', label: 'Tres' }
			]
		},
		{
			category: 'relationship',
			label: 'Relaciones',
			items: [
				{ id: 'cuatro', label: 'Cuatro' },
				{ id: 'cinco', label: 'Cinco' },
				{ id: 'seis', label: 'Seis' }
			]
		},
		{
			category: 'vocation',
			label: 'Vocación',
			items: [
				{ id: 'siete', label: 'Siete' },
				{ id: 'ocho', label: 'Ocho' },
				{ id: 'nueve', label: 'Nueve' }
			]
		},
		{
			category: 'spirituality',
			label: 'Espiritualidad',
			items: [
				{ id: 'diez', label: 'Diez' },
				{ id: 'once', label: 'Once' },
				{ id: 'doce', label: 'Doce' }
			]
		}
	];

	const criteriaOptions = [
		{
			category: 'criteria ',
			label: 'Criterios',
			items: [
				{ id: 'uno', label: 'Uno' },
				{ id: 'dos', label: 'Dos' },
				{ id: 'tres', label: 'Tres' }
			]
		}
	];

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

	let { data } = $props();
	let problems = $state(data.problems);

	$inspect({ problems });
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
		<ViewFilterSelect
			name="pillars"
			options={problemsOptions}
			placeholder="Selecciona un problema"
			isAll
		/>
		<ViewFilterSelect
			name="pillars"
			options={criteriaOptions}
			placeholder="Selecciona un criterio"
		/>
		<ViewFilterSelect
			name="pillars"
			options={criteriaOptions}
			placeholder="Selecciona un criterio"
		/>
	</div>

	<div bind:this={tableHeaderRef} class="sticky z-10 bg-white">
		<ViewHeaderTable />
	</div>

	<div
		bind:this={tableContainerRef}
		class="z-10 w-full overflow-hidden overscroll-contain rounded-b-xl border border-alineados-gray-100 bg-white"
	>
		<ViewTable />
	</div>
</div>
