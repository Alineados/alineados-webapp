<script lang="ts">
	import CardFilter from '$lib/components/CardFilter.svelte';
	import SelectablePill from '$lib/components/SelectablePill.svelte';
	import type { PillarItems } from '$lib/interfaces';

	let {
		handleSelectedPillar
	}: {
		handleSelectedPillar?: (item: PillarItems) => void;
	} = $props();

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

<div class="flex flex-col gap-3 border-b border-alineados-gray-100">
	<div class="flex flex-row gap-2">
		<CardFilter
			type="complex"
			text="Relaciones"
			bind:selected={cardFilter.all}
			triggerFunction={() => {
				changeFilter('all');
			}}
		/>
		<CardFilter
			type="complex"
			text="Salud"
			bind:selected={cardFilter.active}
			triggerFunction={() => {
				changeFilter('active');
			}}
		/>
		<CardFilter
			type="complex"
			text="Espiritualidad"
			bind:selected={cardFilter.inactive}
			triggerFunction={() => {
				changeFilter('inactive');
			}}
		/>
	</div>

	<div class="flex flex-row gap-2 pb-4">
		<SelectablePill text="nombre #1" />
		<SelectablePill text="nombre #2" />
	</div>
</div>
