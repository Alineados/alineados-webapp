<script lang="ts">
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import PersonalStatistics from '$lib/modules/personal/PersonalStatistics.svelte';
	import ThoughtCarousel from '$lib/modules/personal/thoughts/ThoughtCarousel.svelte';
	import ThoughtFilter from '$lib/modules/personal/thoughts/ThoughtFilter.svelte';
	import ThoughtHeader from '$lib/modules/personal/thoughts/ThoughtHeader.svelte';
</script>

<PersonalHeader>
	{#snippet header()}
		<ThoughtHeader status="new" />
	{/snippet}

	{#snippet statistics()}
		<PersonalStatistics type="thoughts" />
	{/snippet}

	{#snippet filter()}
		<ThoughtFilter />
	{/snippet}
</PersonalHeader>

<!-- Content scrollable in Y -->
<div class="flex flex-col items-center justify-center gap-12">
	<ThoughtCarousel />
</div>
