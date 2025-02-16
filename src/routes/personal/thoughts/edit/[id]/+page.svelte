<script lang="ts">
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import PersonalSelect from '$lib/modules/personal/PersonalSelect.svelte';
	import { Pillars } from '$lib/interfaces/data';
	import MultiEditable from '$lib/modules/personal/MultiEditable.svelte';
	import ThoughtHeader from '$lib/modules/personal/thoughts/ThoughtHeader.svelte';
	import type { PageProps } from './$types';
	import type { Thought } from '$lib/interfaces';
	import { thoughtState } from '$lib/stores/personal/thought/thought.svelte';

	let checked = $state(false);

	const Purposes = {
		attitude: {
			id: '1',
			name: 'attitude',
			label: 'Actitud',
			categories: []
		},
		love: {
			id: '2',
			name: 'love',
			label: 'Amor',
			categories: []
		},
		give: {
			id: '3',
			name: 'give',
			label: 'Dar',
			categories: []
		},
		understanding: {
			id: '4',
			name: 'understanding',
			label: 'Entendimiento',
			categories: []
		},
		succeed: {
			id: '5',
			name: 'succeed',
			label: 'Éxito',
			categories: []
		},
		relations: {
			id: '6',
			name: 'relations',
			label: 'Relaciones',
			categories: []
		},
		result: {
			id: '7',
			name: 'result',
			label: 'Resultados',
			categories: []
		},
		servet: {
			id: '8',
			name: 'servet',
			label: 'Servir',
			categories: []
		},
		solution: {
			id: '9',
			name: 'solution',
			label: 'Solución',
			categories: []
		},
		qualityTime: {
			id: '10',
			name: 'qualityTime',
			label: 'Tiempo de calidad',
			categories: []
		}
	};

	let { data }: PageProps = $props();
	console.log('data xd', data);

	const { thought }: { thought: Thought } = data;

	console.log('data thought', thought);

	// // init story state
	thoughtState.init(thought);
</script>

<PersonalHeader simple={true}>
	{#snippet header()}
		<ThoughtHeader status="edit" bind:title={thoughtState.thought_name} />
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
					subCategory={false}
					list={[
						{ ...Purposes.attitude },
						{ ...Purposes.love },
						{ ...Purposes.give },
						{ ...Purposes.understanding },
						{ ...Purposes.succeed },
						{ ...Purposes.relations },
						{ ...Purposes.result },
						{ ...Purposes.servet },
						{ ...Purposes.solution },
						{ ...Purposes.qualityTime }
					]}
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
			<p class="text-base font-bold text-alineados-gray-900">Tiempo de calidad</p>
			<MultiEditable />
		</div>
	</div>
</div>
