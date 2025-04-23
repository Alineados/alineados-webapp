<script lang="ts">
	import CardFilter from '$lib/components/CardFilter.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import { thoughtsState } from '$lib/stores';
	import { onMount } from 'svelte';

	let {
		selectedType = $bindable(),
		purposes = $bindable([])
	} = $props();

	let pillar_name = $state<keyof typeof cardFilter>('pillar');

	let cardFilter = $state<{
		pillar: boolean;
		purpose: boolean;
	}>({
		pillar: true,  // Set default to true
		purpose: false
	});

	function changeFilter(filter: keyof typeof cardFilter) {
		cardFilter.pillar = false;
		cardFilter.purpose = false;
		cardFilter[filter] = true;
		selectedType = filter;
		// Trigger refiltering when filter type changes
		thoughtsState.filter(selectedType);
	}

	// Watch for changes in onlyImportant
	$effect(() => {
		thoughtsState.filter(selectedType);
	});

	onMount(() => {
		cardFilter[pillar_name] = true;
		// Initial filter
		thoughtsState.filter(selectedType);
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
				disabled={!purposes || purposes.length === 0}
			/>
		</div>
	</div>
	<Toggle 
		description="Destacado" 
		bind:checked={thoughtsState.onlyImportant} 
	/>
</div>
