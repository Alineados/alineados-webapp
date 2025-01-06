<script lang="ts">
	import CardFilter from '$lib/components/CardFilter.svelte';
	import SelectablePill from '$lib/components/SelectablePill.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import { Pillars } from '$lib/interfaces/data';

	import { onMount } from 'svelte';

	let pillar_name = $state<keyof typeof cardFilter>('health');
	let subcategoryId = $state<string>('1');

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

	function handleOnCategoryChange(pid: string, name: string) {
		subcategoryId = pid;
	}
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

<div
	class="mt-4 flex flex-row items-start justify-between gap-3 px-4 md:px-8 lg:px-16"
>
	<div class="flex flex-col gap-2">
		<div class="flex flex-row gap-2">
			<CardFilter
				type="complex"
				text="Salud"
				bind:selected={cardFilter.health}
				triggerFunction={() => changeFilter('health')}
			/>

			<CardFilter
				type="complex"
				text="Relación"
				bind:selected={cardFilter.relational}
				triggerFunction={() => changeFilter('relational')}
			/>

			<CardFilter
				type="complex"
				text="Vocación"
				bind:selected={cardFilter.vocational}
				triggerFunction={() => changeFilter('vocational')}
			/>

			<CardFilter
				type="complex"
				text="Espiritualidad"
				bind:selected={cardFilter.spiritual}
				triggerFunction={() => changeFilter('spiritual')}
			/>
		</div>

		<div class="flex flex-row gap-2 pb-2">
			{#if cardFilter.health}
				{#each Pillars.health.categories as health}
					{#if health.id === subcategoryId}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={health.id}
							name="health"
							selected
							bind:text={health.name}
						/>
					{:else}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={health.id}
							name="health"
							bind:text={health.name}
						/>
					{/if}
				{/each}
			{/if}

			{#if cardFilter.relational}
				{#each Pillars.relational.categories as relational}
					{#if relational.id === subcategoryId}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={relational.id}
							name="relational"
							selected
							bind:text={relational.name}
						/>
					{:else}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={relational.id}
							name="relational"
							bind:text={relational.name}
						/>
					{/if}
				{/each}
			{/if}

			{#if cardFilter.vocational}
				{#each Pillars.vocational.categories as vocational}
					{#if vocational.id === subcategoryId}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={vocational.id}
							name="vocational"
							selected
							bind:text={vocational.name}
						/>
					{:else}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={vocational.id}
							name="vocational"
							bind:text={vocational.name}
						/>
					{/if}
				{/each}
			{/if}

			{#if cardFilter.spiritual}
				{#each Pillars.spiritual.categories as spiritual}
					{#if spiritual.id === subcategoryId}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={spiritual.id}
							name="spiritual"
							selected
							bind:text={spiritual.name}
						/>
					{:else}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={spiritual.id}
							name="spiritual"
							bind:text={spiritual.name}
						/>
					{/if}
				{/each}
			{/if}
		</div>
	</div>
	<Toggle description="Destacado" />
</div>
