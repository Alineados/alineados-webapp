<script lang="ts">
	import CardFilter from '$lib/components/CardFilter.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import { onMount } from 'svelte';

	// Props
	let {
		selectedType = $bindable()
	}: {
		selectedType: string;
	} = $props();

	let pillar_name = $state<keyof typeof cardFilter>('pillar');
	let subcategoryId = $state<string>('1');

	// Filter items object state
	let cardFilter = $state<{
		pillar: boolean;
		fin: boolean;
	}>({
		pillar: false,
		fin: false
	});

	function handleOnCategoryChange(pid: string, name: string) {
		subcategoryId = pid;
	}

	function changeFilter(filter: keyof typeof cardFilter) {
		cardFilter.pillar = false;
		cardFilter.fin = false;
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
				bind:selected={cardFilter.fin}
				triggerFunction={() => changeFilter('fin')}
			/>
		</div>
	</div>
	<Toggle description="Destacado" />
</div>
