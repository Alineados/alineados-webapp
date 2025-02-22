<script lang="ts">
	import type { PageProps } from './$types';
	import Banner from '$lib/modules/personal/stories/Banner.svelte';
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import StoryHeader from '$lib/modules/personal/stories/StoryHeader.svelte';
	import PersonalSelect from '$lib/modules/personal/PersonalSelect.svelte';
	import { Pillars } from '$lib/interfaces/data';
	import MultiEditable from '$lib/modules/personal/MultiEditable.svelte';
	import type { Categories, DataPillar, Story } from '$lib/interfaces';
	import { storyState, pillarState } from '$lib/stores';
	import Item from '$lib/components/Item.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import InformationIcon from '$lib/icons/InformationIcon.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import { set } from 'zod';
	import { onMount } from 'svelte';
	import { SocketService } from '$lib/services/socket';
	import { browser } from '$app/environment';

	let { data }: PageProps = $props();

	const { banner_url, story }: { banner_url: string; story: Story } = data;

	// // init story state
	storyState.init(story, banner_url);

	let socket: SocketService;
	// onmout
	onMount(() => {
		if (browser) {
			socket = new SocketService(storyState.id);
		}

		return () => {
			socket.disconnect();
		};
	});

	let timeout: ReturnType<typeof setTimeout>;
	let autosave: boolean = $state(false);

	// autosave
	$effect(() => {
		if (storyState.storyChange) {
			clearTimeout(timeout);
			autosave = true;
			storyState.autosave = true;
			timeout = setTimeout(() => {
				socket.push('autosave_story', storyState.storyChange as string);

				console.log('autosave story');
				autosave = false;
				storyState.autosave = false;
			}, 2000);
		}
	});

	// Functions
	function handleCategories(value: string) {
		const [pillar_name, category_name, pfid, cid] = value.split('-');

		const pillar: DataPillar = pillarState[pillar_name as keyof typeof Pillars];

		const category: Categories = pillar.categories.find((c) => c.id === cid) as Categories;

		storyState.setPillar(pillar);
		storyState.setCategory(category);
	}

	function handleStoryType(value: string) {
		storyState.setType(value);
	}
</script>

<PersonalHeader simple={true}>
	{#snippet header()}
		<StoryHeader status="edit" bind:title={storyState.story_name} />
	{/snippet}

	{#snippet statistics()}{/snippet}

	{#snippet filter()}{/snippet}
</PersonalHeader>

<!-- Content scrollable in Y -->
<div class="flex flex-col px-4 md:px-8 lg:px-16">
	<!-- Image upload -->
	<Banner imageURL={banner_url} alt={storyState.banner.file_name} edit={true} />

	<!-- Form -->
	<div class="mb-10 flex w-full flex-col gap-8 pt-8">
		<!-- Selects -->
		<div class="flex w-4/12 flex-col gap-6">
			<div class="flex flex-row items-center justify-between">
				<p class="text-base font-bold text-alineados-gray-900">Relato:</p>
				<PersonalSelect
					handleSelect={(value: string) => handleStoryType(value)}
					subCategory={false}
					alreadyValue={storyState.type === 1
						? 'Testimonio'
						: storyState.type === 2
							? 'Conversación'
							: ''}
					list={[
						{
							id: '1',
							name: 'testimony',
							label: 'Testimonio',
							categories: []
						},
						{
							id: '2',
							name: 'conversation',
							label: 'Conversación',
							categories: []
						}
					]}
				/>
			</div>
			<div class="flex flex-row items-center justify-between">
				<p class="text-base font-bold text-alineados-gray-900">Categoria:</p>
				<PersonalSelect
					handleSelect={(value: string) => handleCategories(value)}
					subCategory={true}
					alreadyValue={storyState.category_name}
					list={[
						{ ...pillarState.health },
						{ ...pillarState.relational },
						{ ...pillarState.vocational },
						{ ...pillarState.spiritual }
					]}
				/>
			</div>
		</div>

		<!-- Involved -->
		<div class="flex flex-col">
			<div class="flex items-center gap-2">
				<p class="text-base font-bold text-alineados-gray-900">Involucrados</p>
				<Tooltip
					open={false}
					messages={[
						'De 2 a 5 personas o instituciones que se ven involucradas de forma directa o indirecta en cualquiera de las alternativas presentadas.',
						'Pueden aconsejar al tomador de decisión, pero no toman la decisión final.'
					]}
				>
					<InformationIcon styleTw="size-4" />
				</Tooltip>
			</div>
			<div class="-ml-10 mt-5 flex flex-col gap-2">
				{#each storyState.involved as involded}
					<Item
						w_size="w-1/2"
						deleteItem={() => {
							if (
								storyState.involved[storyState.involved.length - 1].id !== involded.id &&
								involded.description !== ''
							)
								storyState.removeOrClean(involded.id);
						}}
						addItem={() => {
							storyState.addInvolved(involded.id);
						}}
						onInput={() => {
							if (storyState.involved[storyState.involved.length - 1].description !== '')
								storyState.addInvolved(involded.id);
							if (involded.description === '') storyState.removeOrClean(involded.id);
						}}
						isOnlyText={true}
						showOnlyDelete={true}
						bind:value={involded.description}
					/>
				{/each}
			</div>
		</div>

		<!-- Toggle -->
		<Toggle
			description="Destacar"
			bind:checked={storyState.is_important}
			titleStyle="text-base font-bold text-alineados-gray-900"
		/>

		<!-- Experience -->
		<div class="flex flex-col gap-6 pb-9">
			<p class="text-base font-bold text-alineados-gray-900">Experiencia</p>
			<MultiEditable
				type="story"
				storyType="experience"
				bind:files={storyState.experienceDocuments}
				bind:richValue={storyState.experienceText}
				bind:titleAudio={storyState.experienceAudio.file_name}
				bind:contentAudio={storyState.experienceAudio.content!}
			/>
		</div>
		<!-- Life lection -->
		<div class="flex flex-col gap-6">
			<p class="text-base font-bold text-alineados-gray-900">Lección de vida</p>
			<MultiEditable
				type="story"
				storyType="life_lesson"
				bind:files={storyState.life_lessonDocuments}
				bind:richValue={storyState.life_lessonText}
				bind:titleAudio={storyState.life_lessonAudio.file_name}
				bind:contentAudio={storyState.life_lessonAudio.content!}
			/>
		</div>
	</div>
</div>

<!-- <PersonalSelect
	subCategory={false}
	list={[
		{ ...Pillars.health },
		{ ...Pillars.relational },
		{ ...Pillars.vocational },
		{ ...Pillars.spiritual }
	]}
/> -->
