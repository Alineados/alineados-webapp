<script lang="ts">
	import Item from '$lib/components/Item.svelte';
	import DecisionPill from '$lib/components/DecisionPill.svelte';
	import {
		problemInfo,
		markOnlyDoneOrRepeatedItems,
		problemCard,
		changeCompleteStatus,
		isCompleteProblem,

		changeReportProblem

	} from '$lib/stores';
	import { ProblemType } from '$lib/interfaces';
	import Rocket from '$lib/icons/Rocket.svelte';
	import Question from '$lib/icons/Question.svelte';

	// 1. completed 2. not completed 3. default
	let completed = $state<{ alternative: number }>(
		$problemCard.completed_at ? { alternative: 1 } : { alternative: 0 }
	);


</script>

<div class="flex flex-col gap-12">
	<div class="flex flex-col">
		<div class="mr-10 flex items-center  gap-2">
			<Rocket styleTw="size-6 text-alineados-gray-900" />

			<h2 class="text-2xl font-medium text-alineados-gray-900">Plan de Acción</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.action_plan as action}
				{#if action.description !== ''}
					<Item
						doneItem={() => {
							markOnlyDoneOrRepeatedItems(action.id, ProblemType.action_plan, true);
							completed = { alternative: 3 };
							changeCompleteStatus(false);
						}}
						repeatItem={() => {
							markOnlyDoneOrRepeatedItems(action.id, ProblemType.action_plan, false);
						}}
						isOnlyText
						isAccountability={true}
						bind:isRepeated={action.repeatable}
						bind:isDone={action.done}
						bind:value={action.description}
					/>
				{/if}
			{/each}
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
					isDisabled={true}
				/>
				<DecisionPill
					text="Alternativa 2 - No resolví el problema. Ir a editar planes de acción."
					changeSelected={() => {
						completed = { alternative: 2 };
						changeCompleteStatus(false);
						isCompleteProblem(false);

						setTimeout(() => {
							changeReportProblem(1);
						}, 500);
					}}
					selected={completed.alternative === 2}
					isDisabled={true}
				/>
			</div>
		{/if}
	</div>
</div>
