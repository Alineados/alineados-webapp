<script lang="ts">
	import Item from '$lib/components/Item.svelte';
	import PuzzlePiece from '$lib/icons/PuzzlePiece.svelte';
	import DecisionPill from '$lib/components/DecisionPill.svelte';
	import {
		addProblemItem,
		problemInfo,
		removeOrCleanItem,
		markOnlyDoneOrRepeatedItems,
		problemCard,
		changeCompleteStatus
	} from '$lib/stores';
	import { ProblemType } from '$lib/interfaces';
	import Rocket from '$lib/icons/Rocket.svelte';
	import Question from '$lib/icons/Question.svelte';

	// 1. completed 2. not completed 3. default
	let completed = $state<{ alternative: number }>(
		$problemCard.completed_at ? { alternative: 1 } : { alternative: 0 }
	);

	let changeToEdit = $derived.by(() => {
		if (completed.alternative === 2) return false;
		return true;
	});
</script>

<div class="flex flex-col gap-12">
	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Rocket styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Plan de Acción</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#if changeToEdit}
				{#each $problemInfo.action_plan as action}
					{#if action.description !== ''}
						<Item
							deleteItem={() => {
								removeOrCleanItem(action.id, ProblemType.action_plan);
							}}
							addItem={() => {
								addProblemItem(action.id, ProblemType.action_plan);
								completed = { alternative: 3 };
								changeCompleteStatus(false);
							}}
							doneItem={() => {
								markOnlyDoneOrRepeatedItems(action.id, ProblemType.action_plan, true);
								completed = { alternative: 3 };
								changeCompleteStatus(false);
							}}
							repeatItem={() => {
								markOnlyDoneOrRepeatedItems(action.id, ProblemType.action_plan, false);
							}}
							isOnlyText
							isAccountability={changeToEdit}
							bind:isRepeated={action.repeatable}
							bind:isDone={action.done}
							bind:value={action.description}
						/>
					{/if}
				{/each}
			{:else}
				{#each $problemInfo.action_plan as action}
					<Item
						deleteItem={() => {
							removeOrCleanItem(action.id, ProblemType.action_plan);
						}}
						addItem={() => {
							addProblemItem(action.id, ProblemType.action_plan);
							completed = { alternative: 3 };
							changeCompleteStatus(false);
						}}
						doneItem={() => {
							markOnlyDoneOrRepeatedItems(action.id, ProblemType.action_plan, true);
							completed = { alternative: 3 };
							changeCompleteStatus(false);
						}}
						repeatItem={() => {
							markOnlyDoneOrRepeatedItems(action.id, ProblemType.action_plan, false);
						}}
						isOnlyText
						isAccountability={changeToEdit}
						bind:isRepeated={action.repeatable}
						bind:isDone={action.done}
						bind:value={action.description}
					/>
				{/each}
			{/if}
		</div>
	</div>

	<div class="flex flex-col">
		{#if $problemCard.progress === 100}
			<div class="flex items-center gap-2">
				<Question styleTw="size-6 text-alineados-gray-900" />
				<h2 class="text-2xl font-medium text-alineados-gray-900">¿Resolviste el Problema?</h2>
			</div>
			<div class="-ml-10 mt-5 flex flex-col gap-2">
				<DecisionPill
					text="Alternativa 1 - Sí resolví el problema"
					changeSelected={() => {
						completed = { alternative: 1 };
						changeCompleteStatus(true);
					}}
					selected={completed.alternative === 1}
				/>
				<DecisionPill
					text="Alternativa 2 - No resolví el problema. Ir a cambiar el plan de acción"
					changeSelected={() => {
						completed = { alternative: 2 };
						changeCompleteStatus(false);
					}}
					selected={completed.alternative === 2}
				/>
			</div>
		{/if}
	</div>
</div>
