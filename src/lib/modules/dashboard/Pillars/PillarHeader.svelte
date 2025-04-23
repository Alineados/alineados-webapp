<script lang="ts">
	import CardFilter from '$lib/components/CardFilter.svelte';
	import NewProblemButton from '$lib/components/NewProblemButton.svelte';
	import ViewButton from '$lib/components/ViewButton.svelte';
	import { filterBy } from '$lib/stores/pillar/card';

	// Estado local para los filtros
	let cardFilter = {
		all: true,
		active: false,
		inactive: false
	};

	function changeFilter(filter: keyof typeof cardFilter) {
		cardFilter.all = false;
		cardFilter.active = false;
		cardFilter.inactive = false;

		cardFilter[filter] = true;

		filterBy.set(filter);
	}
</script>

<div class="flex flex-col gap-6 pb-6">
	<p class="flex flex-row text-sm font-medium text-alineados-gray-600">Acciones</p>
	<div class="flex flex-col gap-5 border-b border-alineados-gray-200 pb-6 lg:flex-row lg:justify-between">
		<p class="text-5xl font-bold text-alineados-blue-900">Acciones</p>

		<div class="flex flex-row gap-4 self-start">
			<a
				href="https://forms.office.com/r/huDFV67VZB"
				target="_blank"
				class="flex flex-row items-center gap-2 rounded-lg border bg-alineados-orange-800 px-4 py-3 text-sm text-white transition duration-300 ease-in-out hover:shadow-lg"
			>
				<!-- Icono y texto -->
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
				</svg>
				Reportar incidentes
			</a>
			<NewProblemButton />
			<ViewButton />
		</div>
	</div>
</div>

<div class="flex flex-row gap-2 pb-6">
	<CardFilter type="simple" text="Todas" bind:selected={cardFilter.all} triggerFunction={() => changeFilter('all')} />
	<CardFilter type="simple" text="Activas" bind:selected={cardFilter.active} triggerFunction={() => changeFilter('active')} />
	<CardFilter type="simple" text="No Activas" bind:selected={cardFilter.inactive} triggerFunction={() => changeFilter('inactive')} />
</div>
