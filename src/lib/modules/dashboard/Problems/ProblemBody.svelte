<script lang="ts">
	import Item from '$lib/components/Item.svelte';
	import Bolt from '$lib/icons/Bolt.svelte';
	import User from '$lib/icons/User.svelte';
	import CircleCross from '$lib/icons/CircleCross.svelte';
	import Cube from '$lib/icons/Cube.svelte';
	import DecisionMatrix from './DecisionMatrix.svelte';
	import Trophy from '$lib/icons/Trophy.svelte';
	import PuzzlePiece from '$lib/icons/PuzzlePiece.svelte';
	import DecisionPill from '$lib/components/DecisionPill.svelte';
	import InformationButton from '$lib/components/InformationButton.svelte';

	// get stores
	import {
		problemInfo,
		addProblemItem,
		removeOrCleanItem,
		prominentItem,
		changeFinalDecision,
		markDailytItem,
		problemCard,
		matrix
	} from '$lib/stores';
	import { ProblemType } from '$lib/interfaces';
	import Lines from '$lib/icons/Lines.svelte';
	import Rocket from '$lib/icons/Rocket.svelte';
	import Check from '$lib/icons/Check.svelte';
	import Spotlight from '$lib/icons/Spotlight.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import InformationIcon from '$lib/icons/InformationIcon.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { wrap } from 'comlink';
	import MatrixInformation from './MatrixInformation.svelte';
	import { debounce } from '$lib/utils/debounce';

	let errorHandling = writable({
		alternative_max: false,
		objective_max: false
	});

	let worker: Worker;
	let api: any;

	let actionPlanDivRef = writable<HTMLElement>();
	function scrollToActionPlan() {
		$actionPlanDivRef?.scrollIntoView({ behavior: 'smooth' });
	}

	const checkAndFormatQuestion = debounce(() => {
		if ($problemInfo.problem!.description !== '') {
			if ($problemInfo.problem!.description.charAt(0) !== '¿') {
				$problemInfo.problem!.description = `¿${$problemInfo.problem!.description}`;
			}

			if (
				$problemInfo.problem!.description.charAt($problemInfo.problem!.description.length - 1) !==
				'?'
			) {
				$problemInfo.problem!.description = `${$problemInfo.problem!.description}?`;
			}
		}
	}, 1000); // Will trigger 1 second after user stops typing

	onMount(() => {
		if ($problemCard.completed_at === null) scrollToActionPlan();

		// load worker
		if (window.Worker) {
			worker = new Worker(new URL('$lib/workers/matrix.ts', import.meta.url), { type: 'module' });
			api = wrap(worker);
		}
	});
</script>

<div class="mt-9 flex flex-col gap-12">
	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Bolt styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Tomador de decisión</h2>
			<Tooltip
				open={false}
				messages={[
					'Solo puede haber 1 persona; no varios.',
					'Sobre esta persona, gira el contexto - problema - objetivos - alternativas - decisión final y plan de acción'
				]}
			>
				<InformationIcon styleTw="size-4" />
			</Tooltip>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			<Item
				prominentItem={() => {
					prominentItem($problemInfo.decision_taken!.id, ProblemType.decision_taken);
				}}
				deleteItem={() => {
					removeOrCleanItem($problemInfo.decision_taken!.id, ProblemType.decision_taken);
				}}
				dailyItem={() => {
					markDailytItem($problemInfo.decision_taken!.id, ProblemType.decision_taken);
				}}
				isUnique
				bind:isOnlyText={$problemCard.active}
				bind:isStarred={$problemInfo.decision_taken!.prominent}
				bind:isDaily={$problemInfo.decision_taken!.daily}
				bind:value={$problemInfo.decision_taken!.description!}
			/>
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<User styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Involucrados</h2>
			<Tooltip
				open={false}
				messages={[
					'De 2 a 5 personas o instituciones que se ven involucradas de forma directa o indirecta en cualquiera de las alternativas presentadas.',
					'Pueden aconsejar al tomador de decisión, pero no toman la decisión final.'
				]}
			>
				<InformationIcon styleTw="size-4" />
			</Tooltip>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.involved as involded}
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
			{/each}
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Lines styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Contexto</h2>
			<Tooltip
				open={false}
				messages={[
					'De 5-8 causa raíz (acción, pensamiento o palabra) que ayuden a entender las circunstancias que está pasando y están originando el problema.',
					'Se recomienda oraciones cortas entre 3-8 palabras por cada contexto con el fin de no tener párrafos extensos.'
				]}
			>
				<InformationIcon styleTw="size-4" />
			</Tooltip>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.contexts as context}
				<Item
					deleteItem={() => {
						if (
							$problemInfo.contexts[$problemInfo.contexts.length - 1].id !== context.id &&
							context.description !== ''
						) {
							removeOrCleanItem(context.id, ProblemType.contexts);
						}
					}}
					addItem={() => {
						addProblemItem(context.id, ProblemType.contexts);
					}}
					prominentItem={() => {
						prominentItem(context.id, ProblemType.contexts);
					}}
					dailyItem={() => {
						markDailytItem(context.id, ProblemType.contexts);
					}}
					onInput={() => {
						if ($problemInfo.contexts[$problemInfo.contexts.length - 1].description !== '') {
							addProblemItem(context.id, ProblemType.contexts);
						}

						if (context.description === '') {
							removeOrCleanItem(context.id, ProblemType.contexts);
						}
					}}
					bind:isOnlyText={$problemCard.active}
					bind:isDaily={context.daily}
					bind:isStarred={context.prominent}
					bind:value={context.description}
				/>
			{/each}
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<CircleCross styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Problema</h2>
			<Tooltip
				open={false}
				messages={[
					'Escribir 1 problema únicamente; no varios',
					'Debe escribirse en formato de pregunta: ¿….?',
					'Verificar que el problema no este como parte de los objetivos ni de las alternativas'
				]}
			>
				<InformationIcon styleTw="size-4" />
			</Tooltip>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			<Item
				deleteItem={() => {
					removeOrCleanItem($problemInfo.problem!.id, ProblemType.problem);
				}}
				prominentItem={() => {
					prominentItem($problemInfo.problem!.id, ProblemType.problem);
				}}
				dailyItem={() => {
					markDailytItem($problemInfo.problem!.id, ProblemType.problem);
				}}
				onInput={checkAndFormatQuestion}
				isUnique
				bind:isOnlyText={$problemCard.active}
				bind:isDaily={$problemInfo.problem!.daily}
				bind:isStarred={$problemInfo.problem!.prominent}
				bind:value={$problemInfo.problem!.description!}
			/>
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Trophy styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Objetivos</h2>
			<Tooltip
				bind:open={$errorHandling.objective_max}
				messages={[
					'De 2-5 objetivos que indiquen los INTERESES del tomador de decisión',
					'Cada objetivo escribirlo con 2-3 palabras ',
					'La primera palabra debe ser un verbo infinitivo (ar-er-ir)',
					'Verificar que el objetivo no este como parte del problema ni de las alternativas'
				]}
			>
				<InformationIcon styleTw="size-4" />
			</Tooltip>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.objectives as objective}
				<Item
					deleteItem={async () => {
						removeOrCleanItem(objective.id, ProblemType.objectives);
						$errorHandling.objective_max = false;

						$matrix = await api.deleteObjective(objective.id, $matrix);
						$matrix = $matrix;
					}}
					addItem={async () => {
						if ($problemInfo.objectives.length === 5) {
							$errorHandling.objective_max = true;
						} else {
							addProblemItem(objective.id, ProblemType.objectives);

							$matrix = await api.addObjective(
								$problemInfo.objectives,
								$problemInfo.alternatives,
								$matrix
							);
							$matrix = $matrix;
						}
					}}
					prominentItem={() => {
						prominentItem(objective.id, ProblemType.objectives);
					}}
					dailyItem={() => {
						markDailytItem(objective.id, ProblemType.objectives);
					}}
					onInput={async () => {
						if ($problemInfo.objectives.length !== 5) {
							if ($problemInfo.objectives[$problemInfo.objectives.length - 1].description !== '') {
								addProblemItem(objective.id, ProblemType.objectives);
							}

							if (objective.description === '') {
								removeOrCleanItem(objective.id, ProblemType.objectives);

								$matrix = await api.deleteObjective(objective.id, $matrix);
								$matrix = $matrix;
							}
						}

						$matrix = await api.addObjective(
							$problemInfo.objectives,
							$problemInfo.alternatives,
							$matrix
						);
						$matrix = $matrix;
					}}
					bind:isOnlyText={$problemCard.active}
					bind:isDaily={objective.daily}
					bind:isStarred={objective.prominent}
					bind:value={objective.description}
				/>
			{/each}
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<PuzzlePiece styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Alternativas</h2>
			<Tooltip
				bind:open={$errorHandling.alternative_max}
				messages={[
					'De 2-3 alternativas que indiquen las OPCIONES/SOLUCIONES del tomador de decisión. Estas deben competir; no complementarse.',
					'Cada alterativa escribirla con 2-3 palabras',
					'NO debe ir escrito en verbo infinitivo (ar-er-ir)',
					'Verificar que la alternativa no este como parte del problema ni de los objetivos',
					'Cada alternativa se debe diferenciar una de la otra….. no deben ser complementarias… para eso…. Tengan claro que acción hará cada alternativa sobre el objetivo'
				]}
			>
				<InformationIcon styleTw="size-4" />
			</Tooltip>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.alternatives as alternative, i}
				<Item
					deleteItem={async () => {
						removeOrCleanItem(alternative.id, ProblemType.alternatives, i);
						$errorHandling.alternative_max = false;

						$matrix = await api.deleteAlternative(alternative.id, $matrix);
						$matrix = $matrix;
					}}
					addItem={async () => {
						if ($problemInfo.alternatives.length === 3) {
							$errorHandling.alternative_max = true;
						} else {
							addProblemItem(alternative.id, ProblemType.alternatives);
							$errorHandling.alternative_max = false;

							$matrix = await api.addAlternative(
								$problemInfo.objectives,
								$problemInfo.alternatives,
								$matrix
							);
							$matrix = $matrix;
						}
					}}
					prominentItem={() => {
						prominentItem(alternative.id, ProblemType.alternatives);
					}}
					dailyItem={() => {
						markDailytItem(alternative.id, ProblemType.alternatives);
					}}
					onInput={async () => {
						if ($problemInfo.alternatives.length !== 3) {
							if (
								$problemInfo.alternatives[$problemInfo.alternatives.length - 1].description !== ''
							)
								addProblemItem(alternative.id, ProblemType.alternatives);

							if (alternative.description === '') {
								removeOrCleanItem(alternative.id, ProblemType.alternatives);

								$matrix = await api.deleteAlternative(alternative.id, $matrix);
								$matrix = $matrix;
							}
						}

						$matrix = await api.addAlternative(
							$problemInfo.objectives,
							$problemInfo.alternatives,
							$matrix
						);

						$matrix = $matrix;
					}}
					bind:isOnlyText={$problemCard.active}
					bind:isDaily={$problemInfo.alternatives[i].daily}
					bind:isStarred={$problemInfo.alternatives[i].prominent}
					bind:value={$problemInfo.alternatives[i].description}
				/>
			{/each}
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Cube styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Matriz de Decisión</h2>
			<InformationButton tittle="Pasos que debe realizar">
				<MatrixInformation />
			</InformationButton>
		</div>
		{#if $matrix.rows.length > 0 && $matrix.cols.length > 0}
			{#if !$problemCard.active}
				<div class="pointer-events-none opacity-50">
					<DecisionMatrix />
				</div>
			{:else}
				<DecisionMatrix />
			{/if}
		{:else}
			<p class="pl-2 pt-4 text-alineados-gray-400">
				No hay objetivos ni alternativas para completar la matriz
			</p>
		{/if}
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Spotlight styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Decisión Recomendada</h2>
			<Tooltip
				open={false}
				messages={[
					'Decisión automática recomendada por el Alineados acorde el resultado de los puntos.'
				]}
			>
				<InformationIcon styleTw="size-4" />
			</Tooltip>
		</div>
		<div class=" mt-5 flex flex-col gap-2">
			{#if $matrix.results && $matrix.results.winner !== -1}
				<DecisionPill
					index={$matrix.results.winner + 1}
					selected={true}
					isDisabled={true}
					bind:text={$problemInfo.alternatives[$matrix.results.winner].description}
				/>
			{:else}
				<p class="pl-2 text-alineados-gray-400">
					Complete la matriz para obtener una decisión recomendada
				</p>
			{/if}
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Check styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Mi Decisión Final</h2>
			<Tooltip
				open={false}
				messages={[
					'Decisión final que el usuario elije acorde su criterio personal; no tiene que ser necesariamente la que Alineados le recomienda',
					'Solo puede haber 1 decisión.'
				]}
			>
				<InformationIcon styleTw="size-4" />
			</Tooltip>
		</div>
		<div class="mt-5 flex flex-col gap-2">
			{#if $problemInfo.alternatives.length === 1 && $problemInfo.alternatives[0].description === ''}
				<p class="pl-2 text-alineados-gray-400">
					No hay alternativas para tomar una decisión final
				</p>
			{:else}
				{#each $problemInfo.alternatives as alternative, i}
					{#if alternative.description !== ''}
						<DecisionPill
							changeSelected={() => {
								changeFinalDecision(alternative.id);
							}}
							index={i + 1}
							selected={alternative.id === $problemInfo.final_decision}
							bind:isDisabled={$problemCard.active}
							bind:text={alternative.description}
						/>
					{/if}
				{/each}
			{/if}
		</div>
	</div>

	<div class="flex flex-col" bind:this={$actionPlanDivRef} id="actionPlanDiv">
		<div class="flex items-center justify-between">
			<div class="flex flex-row items-center justify-center gap-2">
				<Rocket styleTw="size-6 text-alineados-gray-900" />
				<h2 class="text-2xl font-medium text-alineados-gray-900">Plan de Acción</h2>
				<Tooltip
					open={false}
					messages={[
						'El compromiso a la acción debe ser en base a la decisión final; no de todas las alternativas',
						'De 4-6 planes de acción que ayuden a ejecutar la decisión final',
						'Se recomienda oraciones cortas entre 3-8 palabras por cada contexto con el fin de no tener párrafos extensos'
					]}
				>
					<InformationIcon styleTw="size-4" />
				</Tooltip>
			</div>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.action_plan as action, i}
				<Item
					deleteItem={() => {
						if (
							$problemInfo.action_plan[$problemInfo.action_plan.length - 1].id !== action.id &&
							action.description !== ''
						) {
							removeOrCleanItem(action.id, ProblemType.action_plan);
						}
					}}
					addItem={() => {
						addProblemItem(action.id, ProblemType.action_plan);
					}}
					prominentItem={() => {
						prominentItem(action.id, ProblemType.action_plan);
					}}
					dailyItem={() => {
						markDailytItem(action.id, ProblemType.action_plan);
					}}
					onInput={() => {
						if ($problemInfo.action_plan[$problemInfo.action_plan.length - 1].description !== '') {
							addProblemItem(action.id, ProblemType.action_plan);
						}

						if (action.description === '') {
							removeOrCleanItem(action.id, ProblemType.action_plan);
						}
					}}
					bind:isOnlyText={$problemCard.active}
					bind:isDaily={$problemInfo.action_plan[i].daily}
					bind:isStarred={$problemInfo.action_plan[i].prominent}
					bind:value={$problemInfo.action_plan[i].description}
					bind:isDone={$problemInfo.action_plan[i].done}
					bind:isRepeated={$problemInfo.action_plan[i].repeatable}
				/>
			{/each}
		</div>
	</div>
</div>
