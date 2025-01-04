<script lang="ts">
	import CardFilter from '$lib/components/CardFilter.svelte';
	import SelectablePill from '$lib/components/SelectablePill.svelte';

	import {
		healthProblems,
		relationalProblems,
		spiritualProblems,
		vocationalProblems,
		problemCard
	} from '$lib/stores';
	import { onMount } from 'svelte';

	let { pillar_name, pid }: { pillar_name: keyof typeof cardFilter; pid: string } = $props();

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

<div class="flex flex-col gap-3 px-4 md:px-8 lg:px-16 mt-4">
	<div class="flex flex-row gap-2">
		{#if $healthProblems.length > 0}
			<CardFilter
				type="complex"
				text="Salud"
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

	<div class="flex flex-row gap-2 pb-2">
		{#if cardFilter.health}
			{#each $healthProblems as health, i}
				{#if health.id === pid}
					<SelectablePill
						pid={health.id}
						name="health"
						selected
						bind:text={$problemCard.problem_name}
					/>
				{:else}
					<SelectablePill pid={health.id} name="health" bind:text={$healthProblems[i].problem_name} />
				{/if}
			{/each}
		{/if}
		{#if cardFilter.relational}
			{#each $relationalProblems as relational}
				{#if relational.id === pid}
					<SelectablePill
						pid={relational.id}
						name="relational"
						selected
						bind:text={$problemCard.problem_name}
					/>
				{:else}
					<SelectablePill
						pid={relational.id}
						name="relational"
						bind:text={relational.problem_name}
					/>
				{/if}
			{/each}
		{/if}
		{#if cardFilter.vocational}
			{#each $vocationalProblems as vocational}
				{#if vocational.id === pid}
					<SelectablePill
						pid={vocational.id}
						name="vocational"
						selected
						bind:text={$problemCard.problem_name}
					/>
				{:else}
					<SelectablePill
						pid={vocational.id}
						name="vocational"
						bind:text={vocational.problem_name}
					/>
				{/if}
			{/each}
		{/if}
		{#if cardFilter.spiritual}
			{#each $spiritualProblems as spiritual}
				{#if spiritual.id === pid}
					<SelectablePill
						pid={spiritual.id}
						name="spiritual"
						selected
						bind:text={$problemCard.problem_name}
					/>
				{:else}
					<SelectablePill pid={spiritual.id} name="spiritual" bind:text={spiritual.problem_name} />
				{/if}
			{/each}
		{/if}
	</div>
</div>
