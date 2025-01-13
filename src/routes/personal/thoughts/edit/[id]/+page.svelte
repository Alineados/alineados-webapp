<script lang="ts">
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import StoryHeader from '$lib/modules/personal/stories/StoryHeader.svelte';
	import PersonalSelect from '$lib/modules/personal/PersonalSelect.svelte';
	import { Pillars } from '$lib/interfaces/data';
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
	<!-- Form -->
	<div class="mb-10 flex w-full flex-col gap-8 pt-4">
		<!-- Selects -->
		<div class="flex w-4/12 flex-col gap-6">
			<div class="flex flex-row items-center justify-between">
				<p class="text-base font-bold text-alineados-gray-900">Pilar</p>
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
			<div class="flex flex-row items-center justify-between">
				<p class="text-base font-bold text-alineados-gray-900">Fin</p>
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

		<!-- Quality time -->
		<div class="flex flex-col gap-6 pb-9">
			<p class="text-base font-bold text-alineados-gray-900">Tiempo de calidad</p>
			<MultiEditable />
		</div>
	</div>
</div>
