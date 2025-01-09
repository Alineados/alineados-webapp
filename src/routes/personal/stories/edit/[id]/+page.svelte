<script lang="ts">
	import Banner from '$lib/modules/personal/Banner.svelte';
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import StoryHeader from '$lib/modules/personal/stories/StoryHeader.svelte';
	import PersonalSelect from '$lib/modules/personal/PersonalSelect.svelte';
	import { Pillars } from '$lib/interfaces/data';
	import { Pill } from 'lucide-svelte';
	import MultiEditable from '$lib/modules/personal/MultiEditable.svelte';
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
	<div class="flex flex-row mb-10">
		<div class=" flex flex-row">

		</div>
		<div class="">

		</div>
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

		<PersonalSelect
			subCategory={true}
			list={[
				{ ...Pillars.health },
				{ ...Pillars.relational },
				{ ...Pillars.vocational },
				{ ...Pillars.spiritual }
			]}
		/>

		<PersonalSelect
			subCategory={false}
			list={[
				{ ...Pillars.health },
				{ ...Pillars.relational },
				{ ...Pillars.vocational },
				{ ...Pillars.spiritual }
			]}
		/>
	</div>

	<MultiEditable />
</div>
