<script lang="ts">
	import CardFilter from '$lib/components/CardFilter.svelte';
	import SelectablePill from '$lib/components/SelectablePill.svelte';

	import {
		healthProblems,
		relationalProblems,
		spiritualProblems,
		vocationalProblems
	} from '$lib/stores';
	import { onMount } from 'svelte';

	let { pillar_name, pid }: { pillar_name: keyof typeof cardFilter, pid: string } = $props();

	// Filter items object state
	let cardFilter = $state<{
		health: boolean;
		relational: boolean;
		vocational: boolean;
		spiritual: boolean;
	}>({
		health: false,
		relational: false,
		vocational: false,
		spiritual: false
	});

	function changeFilter(filter: keyof typeof cardFilter) {
		cardFilter.health = false;
		cardFilter.relational = false;
		cardFilter.vocational = false;
		cardFilter.spiritual = false;

		cardFilter[filter] = true;
	}

	onMount(() => {
		cardFilter[pillar_name] = true;
	});
</script>

<div class="flex flex-col gap-3 border-b border-alineados-gray-100">
	<div class="flex flex-row gap-2">
		{#if $healthProblems.length > 0}
			<CardFilter
				type="complex"
				text="  Salud"
				bind:selected={cardFilter.health}
				triggerFunction={() => changeFilter('health')}
			/>
		{/if}
		{#if $relationalProblems.length > 0}
			<CardFilter
				type="complex"
				text="Relación"
				bind:selected={cardFilter.relational}
				triggerFunction={() => changeFilter('relational')}
			/>
		{/if}
		{#if $vocationalProblems.length > 0}
			<CardFilter
				type="complex"
				text="Vocación"
				bind:selected={cardFilter.vocational}
				triggerFunction={() => changeFilter('vocational')}
			/>
		{/if}
		{#if $spiritualProblems.length > 0}
			<CardFilter
				type="complex"
				text="Espiritualidad"
				bind:selected={cardFilter.spiritual}
				triggerFunction={() => changeFilter('spiritual')}
			/>
		{/if}
	</div>

	<div class="flex flex-row gap-2 pb-4">
		{#if cardFilter.health}
			{#each $healthProblems as health}
				<SelectablePill selected={health.id === pid} text={health.problem_name} />
			{/each}
		{/if}
		{#if cardFilter.relational}
			{#each $relationalProblems as relational}
				<SelectablePill selected={relational.id === pid} text={relational.problem_name} />
			{/each}
		{/if}
		{#if cardFilter.vocational}
			{#each $vocationalProblems as vocational}
				<SelectablePill selected={vocational.id === pid} text={vocational.problem_name} />
			{/each}
		{/if}
		{#if cardFilter.spiritual}
			{#each $spiritualProblems as spiritual}
				<SelectablePill selected={spiritual.id === pid} text={spiritual.problem_name} />
			{/each}
		{/if}
	</div>
</div>
