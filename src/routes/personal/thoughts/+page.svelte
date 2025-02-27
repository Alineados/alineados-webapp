<script lang="ts">
	import type { PageProps } from './$types';
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import PersonalStatistics from '$lib/modules/personal/PersonalStatistics.svelte';
	import ThoughtItem from '$lib/modules/personal/thoughts/ThoughtItem.svelte';
	import ThoughtCarousel from '$lib/modules/personal/thoughts/ThoughtCarousel.svelte';
	import ThoughtFilter from '$lib/modules/personal/thoughts/ThoughtFilter.svelte';
	import ThoughtHeader from '$lib/modules/personal/thoughts/ThoughtHeader.svelte';
	import type { DataPurpose, Thought } from '$lib/interfaces';
	import { pillarState, purposesState, thoughtsState } from '$lib/stores';

	import Health from '$lib/icons/Health.svelte';
	import Relational from '$lib/icons/Relational.svelte';
	import Vocacional from '$lib/icons/Vocacional.svelte';
	import Spiritual from '$lib/icons/Spiritual.svelte';

	import Purpose from '$lib/icons/Purpose.svelte';

	let selectedType = $state('pillar');

	let { data }: PageProps = $props();

	const { thoughts, purposes }: { thoughts: Thought[]; purposes: DataPurpose[] } = data;

	purposesState.init(purposes);
	thoughtsState.init(thoughts);

	// Transform pillars into carousel items
	const pillarItems = [
		{
			id: pillarState.health.id,
			icon: Health,
			label: pillarState.health.label
		},
		{
			id: pillarState.relational.id,
			icon: Relational,
			label: pillarState.relational.label
		},
		{
			id: pillarState.vocational.id,
			icon: Vocacional,
			label: pillarState.vocational.label
		},
		{
			id: pillarState.spiritual.id,
			icon: Spiritual,
			label: pillarState.spiritual.label
		}
	];

	// Transform purposes into carousel items
	const purposeItems = purposesState.purposes.map((purpose, index) => ({
		id: purpose.id,
		icon: Purpose,
		label: purpose.label
	}));
</script>

<PersonalHeader>
	{#snippet header()}
		<ThoughtHeader status="new" />
	{/snippet}

	{#snippet statistics()}
		<PersonalStatistics
			type="thoughts"
			bind:first={thoughtsState.thoughtsCount}
			bind:second={thoughtsState.importantCount}
		/>
	{/snippet}

	{#snippet filter()}
		<ThoughtFilter bind:selectedType />
	{/snippet}
</PersonalHeader>

<div class="sticky top-[300px] z-10 w-full bg-white pb-5">
	<ThoughtCarousel
		items={selectedType === 'pillar' ? pillarItems : purposeItems}
		type={selectedType}
	/>
</div>

<div class="flex flex-col items-center justify-center gap-4 px-32">
	{#if thoughtsState.thoughtsFiltered.length === 0}
		<p class="text-alineados-gray-400">
			No hay pensamientos, haz clic en el botón de "Nuevo Pensamiento" para agregar uno.
		</p>
	{:else}
		{#each thoughtsState.thoughtsFiltered as thought}
			<ThoughtItem {thought} w_size="w-full" />
		{/each}
	{/if}
</div>
