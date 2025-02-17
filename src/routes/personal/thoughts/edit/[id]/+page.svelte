<script lang="ts">
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import PersonalSelect from '$lib/modules/personal/PersonalSelect.svelte';
	import { Pillars } from '$lib/interfaces/data';
	import MultiEditable from '$lib/modules/personal/MultiEditable.svelte';
	import ThoughtHeader from '$lib/modules/personal/thoughts/ThoughtHeader.svelte';
	import type { PageProps } from './$types';
	import type { DataPillar, Thought } from '$lib/interfaces';
	import { thoughtState, pillarState, purposesState } from '$lib/stores';

	let { data }: PageProps = $props();

	const { thought }: { thought: Thought } = data;

	// // init story state
	thoughtState.init(thought);

	// variables
	let isSave = $state(false);
	let checked = $state(false);

	// Functions
	function handlePillars(value: string) {
		const [pillar_name] = value.split('-');

		const pillar: DataPillar = pillarState[pillar_name as keyof typeof Pillars];

		thoughtState.setPillar(pillar);
	}

	function handlePurposes(value: string) {
		const [purpose_name] = value.split('-');
		const purpose = purposesState.getPurposeByName(purpose_name);
		if (purpose) {
			thoughtState.setPurpose(purpose);
		}
	}

	$inspect(thoughtState.quality_time);
</script>

<PersonalHeader simple={true}>
	{#snippet header()}
		<ThoughtHeader status="edit" />
	{/snippet}

	{#snippet statistics()}{/snippet}

	{#snippet filter()}{/snippet}
</PersonalHeader>

<!-- Content scrollable in Y -->
<div class="flex flex-col px-4 md:px-8 lg:px-16">
	<!-- Form -->
	<div class="mb-10 flex w-full flex-col gap-8 pt-4">
		<!-- Selects -->
		<div class="flex w-5/12 flex-col gap-6">
			<div class="flex flex-row items-center justify-between">
				<p class="text-base font-bold text-alineados-gray-900">Pilar</p>
				<PersonalSelect
					handleSelect={(value: string) => handlePillars(value)}
					subCategory={false}
					alreadyValue={thoughtState.pillar_name}
					list={[
						{ ...pillarState.health },
						{ ...pillarState.relational },
						{ ...pillarState.vocational },
						{ ...pillarState.spiritual }
					]}
				/>
			</div>
			<div class="flex flex-row items-center justify-between">
				<p class="text-base font-bold text-alineados-gray-900">Fin</p>
				<PersonalSelect
					subCategory={false}
					alreadyValue={thoughtState.purpose_name}
					list={purposesState.purposes}
					handleSelect={handlePurposes}
				/>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<span class="text-base font-bold text-alineados-gray-900">Destacar</span>
			<label class="relative inline-flex cursor-pointer items-center">
				<input type="checkbox" bind:checked class="peer sr-only" />
				<div
					class="peer h-6 w-11 rounded-full bg-alineados-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-alineados-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"
				></div>
			</label>
		</div>

		<!-- Quality time -->
		<div class="flex flex-col gap-6 pb-9">
			<p class="text-base font-bold text-alineados-gray-900">Tiempo de Calidad</p>
			<MultiEditable
				type="thought"
				storyType="qualitiy_time"
				bind:files={thoughtState.quality_timeDocuments}
				bind:richValue={thoughtState.quality_timeText}
				bind:titleAudio={thoughtState.quality_timeAudio.file_name}
				bind:contentAudio={thoughtState.quality_timeAudio.content!}
			/>
		</div>
	</div>
</div>
