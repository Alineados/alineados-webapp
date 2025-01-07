<script lang="ts">
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import PersonalStatistics from '$lib/modules/personal/PersonalStatistics.svelte';
	import StoryHeader from '$lib/modules/personal/stories/StoryHeader.svelte';
	import ThoughtCarousel from '$lib/modules/personal/thoughts/ThoughtCarousel.svelte';
	import ThoughtFilter from '$lib/modules/personal/thoughts/ThoughtFilter.svelte';
</script>

<PersonalHeader>
	{#snippet header()}
		<StoryHeader status="new" />
	{/snippet}

	{#snippet statistics()}
		<PersonalStatistics />
	{/snippet}

	{#snippet filter()}
		<ThoughtFilter />
	{/snippet}
</PersonalHeader>

<!-- Content scrollable in Y -->
<div class="flex flex-col justify-center items-center gap-12 px-4 md:px-8 lg:px-16 mt-9">
	<ThoughtCarousel />
</div>
