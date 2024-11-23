<script lang="ts">
	import Item from '$lib/components/Item.svelte';
	import PuzzlePiece from '$lib/icons/PuzzlePiece.svelte';
	import DecisionPill from '$lib/components/DecisionPill.svelte';
</script>

<div class="mt-9 flex flex-col gap-12">
	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<PuzzlePiece styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">Plan de Acción</h2>
		</div>
		<div class="-ml-10 mt-5 flex flex-col gap-2">
			<Item
				value="Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. "
			/>
			<Item
				value="Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. "
			/>
			<Item
				value="Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. "
			/>
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<PuzzlePiece styleTw="size-6 text-alineados-gray-900" />
			<h2 class="text-2xl font-medium text-alineados-gray-900">¿Resolviste el Problema?</h2>
		</div>
		<div class=" mt-5 flex flex-col gap-2">
			<DecisionPill text="Lorem ipsum dolor sit amet consectetur." />
			<DecisionPill text="Lorem ipsum dolor sit amet consectetur." />
		</div>
	</div>
</div>
