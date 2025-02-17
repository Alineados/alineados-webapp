<script lang="ts">
	import CardFilter from '$lib/components/CardFilter.svelte';
	import SelectablePill from '$lib/components/SelectablePill.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import { pillarState, storiesState } from '$lib/stores';

	import { onMount } from 'svelte';

	let pillar_name = $state<keyof typeof cardFilter>('all');
	let pfid = $state<string>(''); // pillar id
	let cid = $state<string>(''); // category id

	// Filter items object state
	let cardFilter = $state<{
		all: boolean;
		health: boolean;
		relational: boolean;
		vocational: boolean;
		spiritual: boolean;
	}>({
		all: true,
		health: false,
		relational: false,
		vocational: false,
		spiritual: false
	});

	$effect(() => {
		storiesState.filter(pfid, cid);
	});

	function handleOnCategoryChange(pid: string, name: string) {
		cid = pid;
	}

	function changeFilter(filter:  keyof typeof cardFilter) {
		cardFilter.all = false;
		cardFilter.health = false;
		cardFilter.relational = false;
		cardFilter.vocational = false;
		cardFilter.spiritual = false;

		cardFilter[filter] = true;

		pillar_name = filter;

		if (filter === 'all') {
			pfid = '';
			cid = '';
			return;
		}

		pfid = pillarState[filter].id;
		cid = '';
	}

	onMount(() => {
		cardFilter[pillar_name] = true;
	});
</script>

<div class="mt-4 flex flex-row items-start justify-between gap-3 px-4 md:px-8 lg:px-16">
	<div class="flex flex-col gap-2">
		<div class="flex flex-row gap-2">
			<CardFilter
				type="complex"
				text="Todos"
				bind:selected={cardFilter.all}
				triggerFunction={() => changeFilter('all')}
			/>

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
				{#each pillarState.health.categories as health}
					{#if health.id === cid}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={health.id}
							name="health"
							selected
							bind:text={health.label}
						/>
					{:else}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={health.id}
							name="health"
							bind:text={health.label}
						/>
					{/if}
				{/each}
			{/if}

			{#if cardFilter.relational}
				{#each pillarState.relational.categories as relational}
					{#if relational.id === cid}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={relational.id}
							name="relational"
							selected
							bind:text={relational.label}
						/>
					{:else}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={relational.id}
							name="relational"
							bind:text={relational.label}
						/>
					{/if}
				{/each}
			{/if}

			{#if cardFilter.vocational}
				{#each pillarState.vocational.categories as vocational}
					{#if vocational.id === cid}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={vocational.id}
							name="vocational"
							selected
							bind:text={vocational.label}
						/>
					{:else}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={vocational.id}
							name="vocational"
							bind:text={vocational.label}
						/>
					{/if}
				{/each}
			{/if}

			{#if cardFilter.spiritual}
				{#each pillarState.spiritual.categories as spiritual}
					{#if spiritual.id === cid}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={spiritual.id}
							name="spiritual"
							selected
							bind:text={spiritual.label}
						/>
					{:else}
						<SelectablePill
							onInput={handleOnCategoryChange}
							pid={spiritual.id}
							name="spiritual"
							bind:text={spiritual.label}
						/>
					{/if}
				{/each}
			{/if}
		</div>
	</div>
	<Toggle description="Destacado" bind:checked={storiesState.onlyImportant}  />
</div>
