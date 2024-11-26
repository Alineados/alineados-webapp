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

	const options = [
		{ value: 'uno', label: 'Uno' },
		{ value: 'dos', label: 'Dos' },
		{ value: 'tres', label: 'Tres' }
	];

	let headerRef: HTMLElement;
	let cardContainerRef: HTMLElement;
	let filterContainerRef: HTMLElement;
	let tableContainerRef: HTMLElement;
	let tableHeaderRef: HTMLElement;

	onMount(() => {
		const headerHeight = headerRef.offsetHeight;
		const cardContainerHeight = cardContainerRef.offsetHeight;
		const filterContainerHeight = filterContainerRef.offsetHeight;
		const tableHeaderHeight = tableHeaderRef.offsetHeight;

		console.log(headerHeight + cardContainerHeight + filterContainerHeight);

		cardContainerRef.style.top = `${headerHeight}px`;
		filterContainerRef.style.top = `${headerHeight + cardContainerHeight}px`;
		tableHeaderRef.style.top = `${headerHeight + cardContainerHeight + filterContainerHeight}px`;
		tableContainerRef.style.top = `${headerHeight + cardContainerHeight + filterContainerHeight + tableHeaderHeight}px`;

		console.log(tableContainerRef.style.top);
	});
</script>

<div class="relative h-full">
	<div bind:this={headerRef} class="sticky top-0 z-10 w-full bg-white">
		<ViewHeader />
	</div>
	<div bind:this={cardContainerRef} class="sticky z-10 flex w-full gap-12 bg-white pb-12">
		<ViewCard contentClass="w-full">
			{#snippet content()}
				<div class="flex w-full items-center gap-3 p-6">
					<div class="rounded-xl bg-alineados-green-50 p-4">
						<Hand styleTw="size-9 text-alineados-green-900" />
					</div>
					<div>
						<p class="text-base font-medium text-black">Total de Problemas</p>
						<p class="-mt-1 text-3xl font-semibold text-alineados-gray-800">242</p>
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
								<p class="-mt-1 text-2xl font-medium text-alineados-gray-800">Salud</p>
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
		<ViewFilterSelect label="Pilares" name="pillars" {options} />
		<ViewFilterSelect label="Pilares" name="pillars" {options} />
		<ViewFilterSelect label="Pilares" name="pillars" {options} />
	</div>

	<div bind:this={tableHeaderRef} class="sticky z-10 bg-alineados-gray-50">
		<div class=" top-0 grid grid-cols-3 rounded-xl border border-alineados-gray-100">
			<div
				class="w-1/5 px-6 py-3 text-left text-base font-medium tracking-wider text-alineados-gray-700"
			>
				Nombre identificativo
			</div>
			<div
				class="w-2/5 px-6 py-3 text-left text-base font-medium tracking-wider text-alineados-gray-700"
			>
				Objetivos
			</div>
			<div
				class="w-2/5 px-6 py-3 text-left text-base font-medium tracking-wider text-alineados-gray-700"
			>
				Plan de acción
			</div>
		</div>
	</div>

	<div
		bind:this={tableContainerRef}
		class="w-full overflow-hidden overscroll-contain rounded-xl border border-alineados-gray-100 bg-white pb-12"
	>
		<ViewTable />
	</div>
</div>
