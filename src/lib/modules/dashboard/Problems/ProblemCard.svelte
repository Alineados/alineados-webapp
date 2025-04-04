<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import CustomCard from '$lib/components/CustomCard.svelte';
	import DaysLeft from '$lib/components/DaysLeft.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import StatusPill from '$lib/components/StatusPill.svelte';
	import Padlock from '$lib/icons/Padlock.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';
	import UnPadlock from '$lib/icons/UnPadlock.svelte';
	import { type ProblemCard } from '$lib/interfaces';
	import { pillarState, removeProblem } from '$lib/stores';
	import { calculateDaysLeft } from '$lib/utils/dates';
	import { set } from 'zod';
	import MessageLength from './MessageLength.svelte';
	import AlertDialog from '$lib/components/AlertDialog.svelte';

	let {
		title,
		problems = $bindable([])
	}: {
		title: string;
		problems: ProblemCard[];
	} = $props();

	let problemSelected: ProblemCard | null = $state(null);
	let openModalDelete = $state(false);
	let deleting = $state(false);
	let formHtml: HTMLFormElement;

	function openModal(problem: ProblemCard, e: any) {
		e.preventDefault();
		e.stopPropagation();
		openModalDelete = true;

		problemSelected = problem;
	}

	function deleteCard(e: any) {
		e.preventDefault();
		e.stopPropagation();

		if (problemSelected && formHtml) formHtml.requestSubmit();

		setTimeout(() => {
			openModalDelete = false;
		}, 500);

		return;
	}

	function setProgressBarStatus(
		problem: ProblemCard
	): 'default' | 'stable' | 'warning' | 'danger' | 'complete' {
		if (calculateDaysLeft(problem.milestone_date) <= 10 && !problem.completed_at) {
			return 'danger';
		} else if (problem.progress === 100 && problem.completed_at) {
			return 'complete';
		} else if (problem.active && problem.progress >= 50) {
			return 'warning';
		} else if (problem.active && problem.progress >= 25) {
			return 'stable';
		} else {
			return 'default';
		}
	}

	function getPillarName(pillar_label: string): string {
		let pillar_name: string = '';
		switch (pillar_label) {
			case 'Salud':
				pillar_name = 'health';
				break;
			case 'Relaciones':
			case 'Relación':
				pillar_name = 'relational';
				break;
			case 'Vocaciones':
			case 'Vocación':
				pillar_name = 'vocational';
				break;
			case 'Espiritual':
				pillar_name = 'spiritual';
				break;
		}

		return pillar_name;
	}

	function handleClickCard(e: any, pid: string, pillar_label: string) {
		e.preventDefault();

		// navigate to problem details
		goto(`./problems/edit?pid=${pid}&pillar_name=${getPillarName(pillar_label)}`);
	}
</script>

<div class="flex flex-col items-start gap-3">
	<p class="pl-2 text-xl font-bold text-alineados-gray-600 md:pl-1">{title}</p>
	<form
		bind:this={formHtml}
		method="POST"
		action="?/delete"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			deleting = true;
			// set data
			if (problemSelected?.id) formData.set('pid', problemSelected.id);
			else console.error('Problem ID is undefined');

			return async ({ result, update }) => {
				// `result` is an `ActionResult` object

				if (result.status === 200)
					if (problemSelected)
						removeProblem(problemSelected, getPillarName(problemSelected.pillar_name));

				// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set

				deleting = false;
			};
		}}
		class="flex w-full flex-row flex-wrap justify-center gap-6 md:justify-start"
	>
		{#if problems.length === 0}
			<MessageLength />
		{/if}
		{#each problems as problem, i}
			<CustomCard
				padding="p-4"
				onClickCard={(e) => handleClickCard(e, problem.id, title)}
				isNew={problem.is_new || !problem.active}
				state={calculateDaysLeft(problem.milestone_date) <= 10 && !problem.completed_at
					? 'danger'
					: problem.active && problem.completed_at
						? 'completed'
						: problem.active
							? 'default'
							: 'default'}
				headerClass="justify-between"
			>
				{#snippet header()}
					<div class="flex w-full flex-row items-center justify-between">
						<div class="flex flex-row items-center gap-1">
							<StatusPill
								classTw="px-2 py-1"
								bind:status={problems[i].active}
								bind:completed={problems[i].completed_at}
							/>

							{#if problem.security}
								<Padlock class="size-4" />
								<!-- <UnPadlock class="size-4" /> -->
							<!-- {:else} -->
							{/if}
						</div>
						<!-- onclick={(e) => deleteCard(problem, e)} -->
						<button
							onclick={(e) => openModal(problem, e)}
							class="rounded-lg p-2 hover:bg-gray-100"
							aria-label="delete-card"
						>
							<TrashCan styleTw="size-4" />
						</button>
					</div>
				{/snippet}
				{#snippet content()}
					<div class="flex flex-col gap-4 pb-3 pt-4">
						<p class="h-14 text-xl font-semibold text-black line-clamp-2 break-words">
							{problem.problem_name.length > 25
								? `${problem.problem_name.slice(0, 25)}...`
								: problem.problem_name}
						</p>
						<div class="flex flex-col gap-1">
							<p class="text-xs font-semibold text-alineados-gray-400">Progreso de tareas</p>
							<ProgressBar progress={problem.progress} state={setProgressBarStatus(problem)} />
						</div>
					</div>
				{/snippet}
				{#snippet footer()}
					<p class="text-xs font-semibold text-alineados-gray-400">{problem.category_name}</p>
					{#if problem.completed_at}
						<p></p>
					{:else}
						<DaysLeft
							targetDate={problem.milestone_date}
							color={calculateDaysLeft(problem.milestone_date) <= 10
								? 'red-500'
								: 'alineados-gray-400'}
							extendedText={!(calculateDaysLeft(problem.milestone_date) <= 10)}
						/>
					{/if}
				{/snippet}
			</CustomCard>
		{/each}
	</form>
</div>

<AlertDialog
	bind:open={openModalDelete}
	title="Eliminar problema"
	description="¿Estás seguro de que deseas eliminar este problema?"
	cancel="Cancelar"
	action="Eliminar"
	handleCancel={() => (openModalDelete = false)}
	handleAction={(e) => deleteCard(e)}
/>
