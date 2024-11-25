<script lang="ts">
	import CardFilter from '$lib/components/CardFilter.svelte';
	import NewProblemButton from '$lib/components/NewProblemButton.svelte';
	import ViewButton from '$lib/components/ViewButton.svelte';
	import type { PillarItems } from '$lib/interfaces';


	// Filter items object state
	let cardFilter = $state<{ all: boolean; active: boolean; inactive: boolean }>({
		all: true,
		active: false,
		inactive: false
	});

	function changeFilter(filter: keyof typeof cardFilter) {
		cardFilter.all = false;
		cardFilter.active = false;
		cardFilter.inactive = false;

		cardFilter[filter] = true;
	}
</script>

<div class="flex flex-col gap-6 pb-6">
	<p class="flex flex-row text-sm font-medium text-alineados-gray-600">Mis Problemas</p>
	<div
		class="flex flex-col gap-5 border-b border-alineados-gray-200 pb-6 lg:flex-row lg:justify-between"
	>
		<p class="text-5xl font-bold text-alineados-blue-900">Situaciones Por Mejorar</p>

		<div class="flex flex-row gap-4 self-start">
			<NewProblemButton />
			<ViewButton />
		</div>
	</div>
</div>

<div class="flex flex-row gap-2 pb-12">
	<CardFilter
		type="simple"
		text="Todos"
		bind:selected={cardFilter.all}
		triggerFunction={() => {
			changeFilter('all');
		}}
	/>
	<CardFilter
		type="simple"
		text="Activos"
		bind:selected={cardFilter.active}
		triggerFunction={() => {
			changeFilter('active');
		}}
	/>
	<CardFilter
		type="simple"
		text="No activas"
		bind:selected={cardFilter.inactive}
		triggerFunction={() => {
			changeFilter('inactive');
		}}
	/>
</div>
