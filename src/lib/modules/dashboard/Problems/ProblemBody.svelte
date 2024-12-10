<script lang="ts">
	import Item from '$lib/components/Item.svelte';
	import Bolt from '$lib/icons/Bolt.svelte';
	import User from '$lib/icons/User.svelte';
	import Like from '$lib/icons/Like.svelte';
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
		problemCard
	} from '$lib/stores';
	import { ProblemType } from '$lib/interfaces';


</script>

<div class="mt-9 flex flex-col gap-12">
	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Bolt styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Tomador de decisión</h2>
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
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.involved as involded}
				<Item
					deleteItem={() => {
						removeOrCleanItem(involded.id, ProblemType.involved);
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
			<Like styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Contexto</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.contexts as context}
				<Item
					deleteItem={() => {
						removeOrCleanItem(context.id, ProblemType.contexts);
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
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.objectives as objective}
				<Item
					deleteItem={() => {
						removeOrCleanItem(objective.id, ProblemType.objectives);
					}}
					addItem={() => {
						addProblemItem(objective.id, ProblemType.objectives);
					}}
					prominentItem={() => {
						prominentItem(objective.id, ProblemType.objectives);
					}}
					dailyItem={() => {
						markDailytItem(objective.id, ProblemType.objectives);
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
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.alternatives as alternative}
				<Item
					deleteItem={() => {
						removeOrCleanItem(alternative.id, ProblemType.alternatives);
					}}
					addItem={() => {
						addProblemItem(alternative.id, ProblemType.alternatives);
					}}
					prominentItem={() => {
						prominentItem(alternative.id, ProblemType.alternatives);
					}}
					dailyItem={() => {
						markDailytItem(alternative.id, ProblemType.alternatives);
					}}
					bind:isOnlyText={$problemCard.active}
					bind:isDaily={alternative.daily}
					bind:isStarred={alternative.prominent}
					bind:value={alternative.description}
				/>
			{/each}
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Cube styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Matriz de decisión</h2>
		</div>
		<div class="flex items-start gap-4">
			<DecisionMatrix />
			<InformationButton
				tittle="Aquí deberá de ir el título"
				description="Aquí deberá ir la explicación de la matríz"
			/>
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<PuzzlePiece styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Desición Recomendada</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			<Item
				isOnlyText={false}
				value="Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. "
			/>
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<PuzzlePiece styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Decisión Final</h2>
		</div>
		<div class=" mt-5 flex flex-col gap-2">
			{#if $problemInfo.objectives.length === 1 && $problemInfo.objectives[0].description === ''}
				<p class="pl-2 text-alineados-gray-400">No hay alternativas</p>
			{:else}
				{#each $problemInfo.alternatives as alternative}
					<DecisionPill
						changeFinalDecision={() => {
							changeFinalDecision(alternative.id);
						}}
						selected={alternative.id === $problemInfo.final_decision}
						bind:text={alternative.description}
					/>
				{/each}
			{/if}
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<PuzzlePiece styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Plan de Acción</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.action_plan as action}
				<Item
					deleteItem={() => {
						removeOrCleanItem(action.id, ProblemType.action_plan);
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
					bind:isOnlyText={$problemCard.active}
					bind:isDaily={action.daily}
					bind:isStarred={action.prominent}
					bind:value={action.description}
				/>
			{/each}
		</div>
	</div>
</div>
