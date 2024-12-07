<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import CustomCard from '$lib/components/CustomCard.svelte';
	import DaysLeft from '$lib/components/DaysLeft.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Padlock from '$lib/icons/Padlock.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';
	import type { ProblemCard } from '$lib/interfaces';
	import { Pillars } from '$lib/interfaces/data';
	import { removeProblem } from '$lib/stores';

	let {
		title,
		problems
	}: {
		title: string;

		problems: ProblemCard[];
	} = $props();

	let problemSelected: ProblemCard | null = $state(null);
	let formHtml: HTMLFormElement;

	function deleteCard(problem: ProblemCard, e: any) {
		e.preventDefault();
		e.stopPropagation();
		problemSelected = problem;

		if (problemSelected && formHtml) {
			formHtml.requestSubmit();
		}
		return;
	}

	function handleClickCard(e: any, pid: string, pillar: string) {
		e.preventDefault();
		console.log(pid, pillar);
		// change pillar name
		let name: string = '';
		switch (pillar) {
			case 'Salud':
				name = 'health';
				break;
			case 'Relación':
				name = 'relational';
				break;
			case 'Vocación':
				name = 'vocational';
				break;
			case 'Espiritual':
				name = 'spiritual';
				break;
		}

		// navigate to problem details
		goto(`./problems/edit?pid=${pid}&pillar_name=${name}`);
	}
</script>

<div class="flex flex-col items-start gap-3">
	<p class="pl-2 text-xl font-bold text-alineados-gray-600 md:pl-1">{title}</p>
	<form
		bind:this={formHtml}
		method="POST"
		action="?/delete"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			// set data
			if (problemSelected?.id) {
				formData.set('pid', problemSelected.id);
			} else {
				console.error('Problem ID is undefined');
			}
			return async ({ result, update }) => {
				// `result` is an `ActionResult` object
				console.log(result);
				if (result.status === 200) {
					if (problemSelected) removeProblem(problemSelected, Pillars);
				}
				// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
			};
		}}
		class="flex w-full flex-row flex-wrap justify-center gap-3 md:justify-start"
	>
		{#if problems.length === 0}
			<p class=" pl-2 text-alineados-gray-400">
				No hay problemas registrados, para agregar uno nuevo haz clic en el botón de "+ Nuevo".
			</p>
		{/if}
		{#each problems as problem, i}
			<CustomCard
				onClickCard={(e) => handleClickCard(e, problem.id, title)}
				isNew={problem.is_new}
				state="default"
				headerClass="justify-between"
			>
				{#snippet header()}
					<div class="flex w-full flex-row items-center justify-between">
						<div class="flex flex-row items-center gap-1">
							<span
								class="rounded-lg bg-alineados-green-100 px-2 py-1 text-xs font-semibold text-alineados-green-900"
							>
								{problem.active ? 'Activo' : 'Inactivo'}
							</span>
							<Padlock class="size-4" />
						</div>
						<button
							onclick={(e) => deleteCard(problem, e)}
							class="rounded-lg p-2 hover:bg-gray-100"
							aria-label="delete-card"
						>
							<TrashCan styleTw="size-4" />
						</button>
					</div>
				{/snippet}
				{#snippet content()}
					<div class="flex flex-col gap-4 pb-3 pt-4">
						<p class="text-xl font-semibold text-black">{problem.problem_name}</p>
						<div class="flex flex-col gap-1">
							<p class="text-xs font-semibold text-alineados-gray-400">Progreso de tareas</p>
							<ProgressBar progress={problem.progress} state="stable" />
						</div>
					</div>
				{/snippet}
				{#snippet footer()}
					<p class="text-xs font-semibold text-alineados-gray-400">{problem.category_name}</p>
					<DaysLeft targetDate={problem.milestone_date} color="alineados-gray-400" />
				{/snippet}
			</CustomCard>
		{/each}
	</form>
</div>
