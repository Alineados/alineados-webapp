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

	let selectedType = $state('pillar');

	let { data }: PageProps = $props();

	const { thoughts, purposes }: { thoughts: Thought[]; purposes: DataPurpose[] } = data;

	purposesState.init(purposes);
	thoughtsState.init(thoughts);

	// Function to get icon based on pillar name
	function getPillarIcon(name: string) {
		switch (name) {
			case 'health':
				return '💪';
			case 'relational':
				return '👥';
			case 'vocational':
				return '💼';
			case 'spiritual':
				return '🙏';
			default:
				return '📌';
		}
	}

	// Transform pillars into carousel items
	const pillarItems = [
		{
			id: pillarState.health.id,
			icon: getPillarIcon('health'),
			label: pillarState.health.label
		},
		{
			id: pillarState.relational.id,
			icon: getPillarIcon('relational'),
			label: pillarState.relational.label
		},
		{
			id: pillarState.vocational.id,
			icon: getPillarIcon('vocational'),
			label: pillarState.vocational.label
		},
		{
			id: pillarState.spiritual.id,
			icon: getPillarIcon('spiritual'),
			label: pillarState.spiritual.label
		}
	];

	// Transform purposes into carousel items
	const purposeItems = purposesState.purposes.map((purpose, index) => ({
		id: purpose.id,
		icon: '🎯', // You can customize this per purpose if needed
		label: purpose.label
	}));
</script>

<PersonalHeader>
	{#snippet header()}
		<ThoughtHeader status="new" />
	{/snippet}

	{#snippet statistics()}
		<PersonalStatistics type="thoughts" />
	{/snippet}

	{#snippet filter()}
		<ThoughtFilter bind:selectedType />
	{/snippet}
</PersonalHeader>

<div class="flex flex-col items-center justify-center gap-12">
	<ThoughtCarousel items={selectedType === 'pillar' ? pillarItems : purposeItems} />
</div>

<div class="flex flex-col items-center justify-center gap-4 px-32">
	{#each thoughtsState.thoughts as thought}
		<ThoughtItem {thought} w_size="w-full" />
	{/each}
</div>
