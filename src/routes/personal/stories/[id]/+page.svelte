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
	import DocumentCard from '$lib/modules/personal/DocumentCard.svelte';

	let { data }: PageProps = $props();

	const { banner_url, story }: { banner_url: string; story: Story } = data;

	function createlistinvolved(involved: Generic[]): string {
		let listinvolved = '';

		if (involved.length === 1 && involved[0].description === '') {
			return 'Sin involucrados';
		}

		involved.forEach((involved) => {
			listinvolved += involved.description + ', ';
		});

		listinvolved = listinvolved.slice(0, -4);
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
	<div class="flex flex-col gap-4 pb-16 pt-8">
		<!-- <StoryText text={storyState.story_name}>
			{#snippet iconSnnipet()}
				<MessageText class="size-6 text-alineados-gray-900" />
			{/snippet}
		</StoryText> -->
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

	<!-- List of data -->
	<div class="flex flex-col gap-2 pb-16">
		<p class="text-3xl font-medium text-alineados-gray-900">Experiencias</p>

		<style>
		    :global(.rich-text ul[style*="direction: ltr"]) {
		        list-style: disc outside !important;
		        padding-left: 2rem !important;
		    }
		
		    :global(.rich-text ul[style*="direction: ltr"] li) {
		        display: list-item !important;
		        margin: 0.5rem 0 !important;
		    }
		
		    :global(.rich-text ul[style*="direction: ltr"] li span) {
		        font-family: Calibri, sans-serif;
		        font-size: 11pt;
		    }
		
		    :global(.rich-text ul ul[style*="direction: ltr"]) {
		        list-style: circle outside !important;
		    }
		    :global(.rich-text ol) {
		        @apply list-decimal ml-6 my-2;
		    }
		    :global(.rich-text li) {
		        @apply text-base text-alineados-gray-900 pl-2;
		    }
		    :global(.rich-text p) {
		        @apply mb-2;
		    }
		    :global(.rich-text) {
		        @apply text-base text-alineados-gray-900;
		    }
		    :global(.rich-text ul[style*="direction: ltr"][type="disc"]) {
		        list-style-type: disc !important;
		        @apply ml-8;
		    }
		    :global(.rich-text ul[style*="direction: ltr"][type="circle"]) {
		        list-style-type: circle !important;
		        @apply ml-8;
		    }
		    :global(.rich-text li[style*="vertical-align: middle"]) {
		        display: list-item !important;
		        @apply my-1;
		    }
		</style>

		<!-- Text -->
		{#if storyState.experience.text}
			<div class="w-full rounded-2xl hover:bg-alineados-gray-50 px-2 py-4 rich-text">
				{@html storyState.experience.text}
			</div>
		{/if}

		<!-- Transcription -->
		{#if storyState.experience.audio}
			<div class=" w-full rounded-2xl hover:bg-alineados-gray-50  px-2 py-4">
				<p class="text-base font-semibold text-alineados-blue-800">Transcripción</p>
				{@html storyState.experience.audio.content}
			</div>
		{/if}

		<!-- List documents -->
		{#if storyState.experience.documents}
			<div class=" w-full rounded-2xl hover:bg-alineados-gray-50 px-2 py-4">
				<p class="text-base font-semibold text-alineados-blue-800">Documentos</p>
				<div class="space-y-3">
					{#each storyState.experience.documents as file}
						<DocumentCard {file} showDelete={false} />
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="flex flex-col gap-2">
		<p class="text-3xl font-medium text-alineados-gray-900">Lecciones de vida</p>

		<!-- Text -->
		{#if storyState.life_lesson.text}
			<div class="w-full rounded-2xl hover:bg-alineados-gray-50 px-2 py-4 rich-text">
				{@html storyState.life_lesson.text}
			</div>
		{/if}

		<!-- Transcription -->
		{#if storyState.life_lesson.audio}
			<div class=" w-full rounded-2xl hover:bg-alineados-gray-50  px-2 py-4">
				<p class="text-base font-semibold text-alineados-blue-800">Transcripción</p>
				{@html storyState.life_lesson.audio.content}
			</div>
		{/if}

		<!-- List documents -->
		{#if storyState.experience.documents}
			<div class=" w-full rounded-2xl hover:bg-alineados-gray-50 px-2 py-4">
				<p class="text-base font-semibold text-alineados-blue-800">Documentos</p>
				<div class="space-y-3">
					{#each storyState.life_lesson.documents as file}
						<DocumentCard {file} showDelete={false} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
    :global(.rich-text) {
        @apply text-base text-alineados-gray-900;
    }

    :global(.rich-text ul) {
        list-style-type: disc !important;
        @apply pl-8 my-2;
    }

    :global(.rich-text ul ul) {
        list-style-type: circle !important;
    }

    :global(.rich-text li) {
        display: list-item !important;
        @apply my-2;
    }

    :global(.rich-text li > span) {
        @apply text-base text-alineados-gray-900;
    }
</style>
