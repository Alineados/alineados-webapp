<script lang="ts">
	import Banner from '$lib/modules/personal/Banner.svelte';
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import StoryHeader from '$lib/modules/personal/stories/StoryHeader.svelte';
	import PersonalSelect from '$lib/modules/personal/PersonalSelect.svelte';
	import { Pillars } from '$lib/interfaces/data';
	import { Pill } from 'lucide-svelte';
	import MultiEditable from '$lib/modules/personal/MultiEditable.svelte';
	import User from '$lib/icons/User.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import InformationIcon from '$lib/icons/InformationIcon.svelte';
	import Item from '$lib/components/Item.svelte';
</script>

<PersonalHeader simple={true}>
	{#snippet header()}
		<StoryHeader status="edit" />
	{/snippet}

	{#snippet statistics()}{/snippet}

	{#snippet filter()}{/snippet}
</PersonalHeader>

<!-- Content scrollable in Y -->
<div class="flex flex-col px-4 md:px-8 lg:px-16">
	<!-- Image upload -->
	<Banner
		imageURL="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VARoRKXUzQbegeeDDHADCUHMWzKVe7.png"
		alt="Prueba"
		edit={true}
	/>

	<!-- Form -->
	<div class="mb-10 flex w-full flex-col gap-8 pt-8">
		<!-- Selects -->
		<div class="flex w-4/12 flex-col gap-6">
			<div class="flex flex-row items-center justify-between">
				<p class="text-base font-bold text-alineados-gray-900">Relato:</p>
				<PersonalSelect
					subCategory={false}
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
					subCategory={true}
					list={[
						{ ...Pillars.health },
						{ ...Pillars.relational },
						{ ...Pillars.vocational },
						{ ...Pillars.spiritual }
					]}
				/>
			</div>
		</div>

		<!-- Involved -->
		<div class="flex flex-col">
			<div class="flex items-center gap-2">
				<p class="text-base font-bold text-alineados-gray-900">Involucrados</p>
				<!-- <Tooltip
					open={false}
					messages={[
						'De 2 a 5 personas o instituciones que se ven involucradas de forma directa o indirecta en cualquiera de las alternativas presentadas.',
						'Pueden aconsejar al tomador de decisión, pero no toman la decisión final.'
					]}
				>
					<InformationIcon styleTw="size-4" />
				</Tooltip> -->
			</div>
			<div class="-ml-10 mt-5 flex flex-col gap-2">
				<!-- {#each $problemInfo.involved as involded}
					<Item
						deleteItem={() => {
							if (
								$problemInfo.involved[$problemInfo.involved.length - 1].id !== involded.id &&
								involded.description !== ''
							) {
								removeOrCleanItem(involded.id, ProblemType.involved);
							}
						}}
						addItem={() => {
							addProblemItem(involded.id, ProblemType.involved);
						}}
						prominentItem={() => {
							prominentItem(involded.id, ProblemType.involved);
						}}
						dailyItem={() => {
							markDailytItem(involded.id, ProblemType.involved);
						}}
						onInput={() => {
							if ($problemInfo.involved[$problemInfo.involved.length - 1].description !== '') {
								addProblemItem(involded.id, ProblemType.involved);
							}

							if (involded.description === '') {
								removeOrCleanItem(involded.id, ProblemType.involved);
							}
						}}
						bind:isOnlyText={$problemCard.active}
						bind:isDaily={involded.daily}
						bind:isStarred={involded.prominent}
						bind:value={involded.description}
					/>
				{/each} -->
			</div>
		</div>

		<!-- Experience -->
		<div class="flex flex-col gap-6 pb-9">
			<p class="text-base font-bold text-alineados-gray-900">Experiencia</p>
			<MultiEditable />
		</div>
		<!-- Life lection -->
		<div class="flex flex-col gap-6">
			<p class="text-base font-bold text-alineados-gray-900">Lección de vida</p>
			<MultiEditable />
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