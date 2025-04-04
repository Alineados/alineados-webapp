<script lang="ts">
	import Item from '$lib/components/Item.svelte';
	import DecisionPill from '$lib/components/DecisionPill.svelte';
	import { Confetti } from 'svelte-confetti';
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
	let showConfetti = $state(false);

	function onCompleteProblem() {
		showConfetti = true;
		isCompleteProblem(true);
		setTimeout(() => {
			showConfetti = false;
		}, 4000);
	}

</script>

<div class="flex flex-col gap-12">
	<div class="flex flex-col">
		<div class="mr-10 flex items-center  gap-2">
			<Rocket styleTw="size-6 text-alineados-gray-900" />

			<h2 class="text-2xl font-medium text-alineados-gray-900">Plan de Acción</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.action_plan as action, i}
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
						bind:isRepeated={$problemInfo.action_plan[i].repeatable}
						bind:isDone={$problemInfo.action_plan[i].done}
						bind:value={$problemInfo.action_plan[i].description}
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
			<div class="-ml-10 mt-5 flex flex-col gap-2 w-full">
				<DecisionPill
					text="Alternativa 1 - Sí resolví el problema"
					changeSelected={() => {
						completed = { alternative: 1 };
						changeCompleteStatus(true);
						onCompleteProblem();
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

<div
	style="
 position: fixed;
 top: -50px;
 left: 0;
 height: 100vh;
 width: 100vw;
 display: flex;
 justify-content: center;
 overflow: hidden;
 pointer-events: none;"
>
	{#if showConfetti}
		<Confetti
			x={[-5, 5]}
			y={[0, 0.1]}
			delay={[500, 2000]}
			infinite
			amount={1000}
			fallDistance="100vh"
		/>
	{/if}
</div>