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

	// get stores
	import { problemInfo, pid } from '$lib/stores';

	$inspect($problemInfo);
</script>

<div class="mt-9 flex flex-col gap-12">
	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Bolt styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Tomador de decisión</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			<Item isDisabled bind:value={$problemInfo.decision_taken!.description!} />
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<User styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Involucrados</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.involved as involded}
				<Item useOrder usePlus isDisabled bind:value={involded.description} />
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
				<Item useOrder usePlus isDisabled bind:value={context.description} />
			{/each}
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<CircleCross styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Problema</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			<Item isDisabled  bind:value={$problemInfo.problem!.description!} />
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Trophy styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Objetivos</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.objectives as objective}
				<Item useOrder usePlus isDisabled bind:value={objective.description} />
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
				<Item useOrder usePlus isDisabled bind:value={alternative.description} />
			{/each}
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Cube styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Matriz de decisión</h2>
		</div>
		<DecisionMatrix />
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<PuzzlePiece styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Desición Recomendada</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			<Item
				isDisabled
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
			<DecisionPill text="Lorem ipsum dolor sit amet consectetur." />
			<DecisionPill text="Lorem ipsum dolor sit amet consectetur." />
			<DecisionPill text="Lorem ipsum dolor sit amet consectetur." />
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<PuzzlePiece styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Plan de Acción</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			{#each $problemInfo.action_plan as action}
				<Item useOrder usePlus isDisabled bind:value={action.description} />
			{/each}
		</div>
	</div>
</div>
