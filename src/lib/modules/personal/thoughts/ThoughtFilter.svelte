<script lang="ts">
	import CardFilter from '$lib/components/CardFilter.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import { thoughtsState } from '$lib/stores';
	import { onMount } from 'svelte';

	// Props
	let {
		selectedType = $bindable()
	}: {
		selectedType: string;
	} = $props();

	let pillar_name = $state<keyof typeof cardFilter>('pillar');

	// Filter items object state
	let cardFilter = $state<{
		pillar: boolean;
		purpose: boolean;
	}>({
		pillar: false,
		purpose: false
	});

	function changeFilter(filter: keyof typeof cardFilter) {
		cardFilter.pillar = false;
		cardFilter.purpose = false;
		cardFilter[filter] = true;
		selectedType = filter;
	}

	onMount(() => {
		cardFilter[pillar_name] = true;
	});
</script>

<div class="mt-4 flex flex-row items-start justify-between gap-3 px-4 md:px-8 lg:px-16">
	<div class="flex flex-col gap-2">
		<div class="flex flex-row gap-2">
			<CardFilter
				showRow={false}
				type="complex"
				text="Pilar"
				bind:selected={cardFilter.pillar}
				triggerFunction={() => changeFilter('pillar')}
			/>

			<CardFilter
				showRow={false}
				type="complex"
				text="Fin"
				bind:selected={cardFilter.purpose}
				triggerFunction={() => changeFilter('purpose')}
			/>
		</div>
	</div>
	<Toggle description="Destacado" bind:checked={thoughtsState.onlyImportant} />
</div>
