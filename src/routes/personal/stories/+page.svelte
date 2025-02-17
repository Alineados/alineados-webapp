<script lang="ts">
	import type { PageProps } from './$types';
	import alineadosImage from '$lib/assets/check-card.png';
	import type { Story } from '$lib/interfaces';
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import PersonalStatistics from '$lib/modules/personal/PersonalStatistics.svelte';
	import StoryHeader from '$lib/modules/personal/stories/StoryHeader.svelte';
	import StoryFilter from '$lib/modules/personal/stories/StoryFilter.svelte';
	import CustomCard from '$lib/components/CustomCard.svelte';

	import ThirdCube from '$lib/icons/ThirdCube.svelte';
	import ThreePeople from '$lib/icons/ThreePeople.svelte';
	import { storiesState } from '$lib/stores';
	import { goto } from '$app/navigation';
	import TrashCan from '$lib/icons/TrashCan.svelte';
	import { enhance } from '$app/forms';
	import AlertDialog from '$lib/components/AlertDialog.svelte';

	let { data }: PageProps = $props();

	let formHtml: HTMLFormElement | null = $state(null);
	let openModalDelete = $state(false);
	let storySelected: Story | null = $state(null);
	let deleting = $state(false);

	const { testimony, conversation }: { testimony: Story[]; conversation: Story[] } = data;

	storiesState.init(testimony, conversation);

	function openModal(story: Story, e: any) {
		e.preventDefault();
		e.stopPropagation();
		openModalDelete = true;

		storySelected = story;
	}

	function deleteCard(e: any) {
		e.preventDefault();
		e.stopPropagation();

		if (storySelected && formHtml) formHtml.requestSubmit();

		setTimeout(() => {
			openModalDelete = false;
		}, 500);

		return;
	}

	function handleClickCard(e: any, sid: string) {
		e.preventDefault();

		// navigate to problem details
		goto(`./stories/${sid}`);
	}
</script>

<PersonalHeader>
	{#snippet header()}
		<StoryHeader status="new" />
	{/snippet}

	{#snippet statistics()}
		<PersonalStatistics
			type="stories"
			bind:first={storiesState.testimoniesCount}
			bind:second={storiesState.conversationsCount}
		/>
	{/snippet}

	{#snippet filter()}
		<StoryFilter />
	{/snippet}
</PersonalHeader>

<!-- Content scrollable in Y -->
<div class="flex flex-col gap-12 px-4 md:px-8 lg:px-16">
	<div class="flex flex-col gap-3">
		<p class="text-xl font-semibold text-alineados-gray-700">Testimonio</p>

		<form
			class="flex flex-row gap-5"
			bind:this={formHtml}
			method="POST"
			action="?/delete"
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				deleting = true;
				// set data
				if (storySelected?.id) formData.set('sid', storySelected.id);
				else console.error('Story ID is undefined');

				return async ({ result, update }) => {
					if (result.status === 200)
						if (storySelected && storySelected.type === 1)
							storiesState.deleteTestimony(storySelected.id);
						else if (storySelected && storySelected.type === 2)
							storiesState.deleteConversation(storySelected.id);

					deleting = false;
				};
			}}
		>
			{#if storiesState.testimoniesFiltered.length === 0}
				<p class="text-alineados-gray-400">
					No hay testimonios, haz clic en el botón de "Nuevo relato" para agregar uno.
				</p>
			{:else}
				{#each storiesState.testimoniesFiltered as testimony}
					<CustomCard
						state={testimony.is_important ? 'important' : 'default'}
						onClickCard={(e) => handleClickCard(e, testimony.id)}
						isNew={false}
						headerClass="justify-between"
					>
						{#snippet header()}
							<div class="relative h-24 w-full">
								<img
									src={alineadosImage}
									alt="Alineados check"
									class="h-full w-full rounded-t-lg bg-alineados-blue-300 object-cover"
								/>
								<button
									class="absolute right-1 top-1 rounded-full p-1 transition-colors"
									aria-label="Mark as favorite"
									onclick={(e) => openModal(testimony, e)}
								>
									<TrashCan styleTw="size-5 text-alineados-gray-50" />
								</button>
							</div>
						{/snippet}

						{#snippet content()}
							<div class="flex flex-col gap-4 px-3 pb-3 pt-4">
								<p class="h-14 text-base font-semibold text-alineados-blue-800">
									{testimony.story_name}
								</p>
							</div>
						{/snippet}

						{#snippet footer()}
							<div class="flex w-full justify-between px-3 pb-4">
								<div class="space-y-1">
									<div class="flex items-center gap-2">
										<ThirdCube styleTw="size-4" />
										<span class="text-xs text-alineados-gray-700">{testimony.category_name}</span>
									</div>
									<div class="flex items-center gap-2">
										<ThreePeople styleTw="size-4" />
										<span class="text-xs text-alineados-gray-700"
											>{testimony.involved.length} involucrados</span
										>
									</div>
								</div>
								<span class="self-end text-xs text-alineados-gray-400">Julio 2024</span>
							</div>
						{/snippet}
					</CustomCard>
				{/each}
			{/if}
		</form>
	</div>

	<div class="flex flex-col gap-3">
		<p class="text-xl font-semibold text-alineados-gray-700">Conversaciones</p>

		<div class="flex flex-row gap-5">
			{#if storiesState.conversationsFiltered.length === 0}
				<p class="text-alineados-gray-400">
					No hay conversaciones, haz clic en el botón de "Nuevo relato" para agregar uno.
				</p>
			{:else}
				{#each storiesState.conversationsFiltered as conversation}
					<CustomCard
						state={conversation.is_important ? 'important' : 'default'}
						onClickCard={(e) => handleClickCard(e, conversation.id)}
						isNew={false}
						headerClass="justify-between"
					>
						{#snippet header()}
							<div class="relative aspect-[5/1] h-24 w-full overflow-hidden" role="img">
								<img
									src={alineadosImage}
									alt="Alineados check"
									class="h-full w-full object-cover object-center"
								/>
								<button
									class="absolute right-1 top-1 rounded-full p-1 transition-colors"
									aria-label="Mark as favorite"
									onclick={(e) => openModal(conversation, e)}
								>
									<TrashCan styleTw="size-5 text-alineados-gray-50" />
								</button>
							</div>
						{/snippet}

						{#snippet content()}
							<div class="flex flex-col gap-4 px-4 pb-3 pt-4">
								<p class="h-14 text-base font-semibold text-alineados-blue-800">
									{conversation.story_name}
								</p>
							</div>
						{/snippet}

						{#snippet footer()}
							<div class="flex w-full justify-between px-4 pb-4">
								<div class="space-y-1">
									<div class="flex items-center gap-2">
										<ThirdCube styleTw="size-4" />
										<span class="text-xs text-alineados-gray-700">
											{conversation.category_name}
										</span>
									</div>
									<div class="flex items-center gap-2">
										<ThreePeople styleTw="size-4" />
										<span class="text-xs text-alineados-gray-700"
											>{conversation.involved.length === 1 &&
											conversation.involved[0].description === ''
												? '0'
												: conversation.involved.length} involucrados</span
										>
									</div>
								</div>
								<span class="self-end text-xs text-alineados-gray-400">Julio 2024</span>
							</div>
						{/snippet}
					</CustomCard>
				{/each}
			{/if}
		</div>
	</div>
</div>

<AlertDialog
	bind:open={openModalDelete}
	title="Eliminar relato"
	description="¿Estás seguro de que deseas eliminar este relato?"
	cancel="Cancelar"
	action="Eliminar"
	handleCancel={() => (openModalDelete = false)}
	handleAction={(e) => deleteCard(e)}
/>
