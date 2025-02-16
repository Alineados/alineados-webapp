<script lang="ts">
	import type { PageProps } from './$types';
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import PersonalStatistics from '$lib/modules/personal/PersonalStatistics.svelte';
	import ThoughtCard from '$lib/modules/personal/thoughts/ThoughtCard.svelte';
	import ThoughtCarousel from '$lib/modules/personal/thoughts/ThoughtCarousel.svelte';
	import ThoughtFilter from '$lib/modules/personal/thoughts/ThoughtFilter.svelte';
	import ThoughtHeader from '$lib/modules/personal/thoughts/ThoughtHeader.svelte';
	import type { Thought } from '$lib/interfaces';
	import { thoughtsState } from '$lib/stores/personal/thought/thoughts.svelte';

	const pillarItems = [
		{ id: 1, icon: '💼', label: 'Trabajo', color: '#4CAF50' },
		{ id: 2, icon: '✝️', label: 'Religión', color: '#4CAF50' },
		{ id: 3, icon: '🏥', label: 'Salud', color: '#4CAF50' },
		{ id: 4, icon: '👥', label: 'Social', color: '#4CAF50' },
		{ id: 5, icon: '💼', label: 'Negocios', color: '#4CAF50' }
	];

	const purposeItems = [
		{ id: 1, icon: '😊', label: 'Actitud', color: '#4CAF50' },
		{ id: 2, icon: '❤️', label: 'Amor', color: '#4CAF50' },
		{ id: 3, icon: '🎁', label: 'Dar', color: '#4CAF50' },
		{ id: 4, icon: '🧠', label: 'Entendimiento', color: '#4CAF50' },
		{ id: 5, icon: '🏆', label: 'Éxito', color: '#4CAF50' },
		{ id: 6, icon: '🤝', label: 'Relaciones', color: '#4CAF50' },
		{ id: 7, icon: '📈', label: 'Resultados', color: '#4CAF50' },
		{ id: 8, icon: '🤲', label: 'Servir', color: '#4CAF50' },
		{ id: 9, icon: '💡', label: 'Solución', color: '#4CAF50' },
		{ id: 10, icon: '⏰', label: 'Tiempo de calidad', color: '#4CAF50' }
	];

	let selectedType = $state('pillar');

	let { data }: PageProps = $props();

	console.log(data);

	const { thoughts }: { thoughts: Thought[] } = data;

	console.log(thoughts);

	thoughtsState.init(thoughts);
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

<div class="flex flex-col items-center justify-center gap-4 px-24">
	{#each thoughtsState.thoughts as thought}
		<ThoughtCard {thought} />
	{/each}
</div>
