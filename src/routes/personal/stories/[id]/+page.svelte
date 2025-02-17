<script lang="ts">
	import type { PageProps } from './$types';
	import Banner from '$lib/modules/personal/stories/Banner.svelte';
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import StoryHeader from '$lib/modules/personal/stories/StoryHeader.svelte';
	import { storyState } from '$lib/stores';
	import StoryText from '$lib/modules/personal/stories/StoryText.svelte';
	import ThirdCube from '$lib/icons/ThirdCube.svelte';
	import ThreePeople from '$lib/icons/ThreePeople.svelte';
	import type { Generic, Story } from '$lib/interfaces';
	import MessageText from '$lib/icons/MessageText.svelte';

	let { data }: PageProps = $props();

	const { banner_url, story }: { banner_url: string; story: Story } = data;


	function createlistinvolved(involved: Generic[] ): string {
		let listinvolved = '';

		if (involved.length === 1 && involved[0].description === '') {
			return 'Sin involucrados';
		}

		involved.forEach((involved) => {
			listinvolved += involved.description + ', ';
		});
		return listinvolved;
	}

	// // init story state
	storyState.init(story, banner_url);
</script>

<PersonalHeader simple={true}>
	{#snippet header()}
		<StoryHeader status="see" />
	{/snippet}

	{#snippet statistics()}{/snippet}

	{#snippet filter()}{/snippet}
</PersonalHeader>

<!-- Content scrollable in Y -->
<div class="flex flex-col px-4 md:px-8 lg:px-16">
	<!-- Image upload -->
	<Banner imageURL={banner_url} alt={storyState.banner.file_name} edit={false} />

	<!-- Data visualizer -->
	<div class="flex flex-col gap-4 pt-8">
		<StoryText text={storyState.story_name}>
			{#snippet iconSnnipet()}
				<MessageText class="size-6 text-alineados-gray-900" />
			{/snippet}
		</StoryText>
		<StoryText text={storyState.category_name}>
			{#snippet iconSnnipet()}
				<ThirdCube styleTw="size-6 text-alineados-gray-900" />
			{/snippet}
		</StoryText>
		<StoryText text={createlistinvolved(storyState.involved)}>

			{#snippet iconSnnipet()}
				<ThreePeople styleTw="size-6 text-alineados-gray-900" />
			{/snippet}
		</StoryText>
	</div>
</div>
