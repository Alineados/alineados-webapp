<script lang="ts">
	import type { MatrixRow } from '$lib/interfaces';
	import * as Select from '$lib/shared/ui/select/index';
	import { getSelectorList, matrix } from '$lib/stores';

	let {
		color = 'alineados-blue-900',
		name = $bindable(),
		key = $bindable(),
		units = $bindable(),
		index
	}: {
		color?: string;
		name: string;
		key: string;
		units: string;
		index: number;
	} = $props();


</script>

<div class="flex items-center justify-start">
	<div class="flex w-2/3 flex-col justify-start gap-2">
		<span class="text-base">
			{name}
		</span>
		<Select.Root type="single" name="importance" bind:value={key}>
			<Select.Trigger
				class="h-fit w-9/12 rounded-md border border-alineados-gray-200 bg-alineados-gray-50 px-1 py-1 text-left text-xs  text-alineados-gray-900"
			>
				{key === '' ? 'Importancia' : key}
			</Select.Trigger>
			<Select.Content class="bg-white text-alineados-blue-900 ">
				{#each getSelectorList($matrix.rows) as item}
					<Select.Item value={item.key} class="text-xs">
						{item.key}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex w-1/3 flex-col items-center gap-1">
		<input class=" text-center text-xs outline-none {color}" bind:value={units} />
		<!-- <input class="text-xs font-medium outline-none {color}" bind:value={units} /> -->
	</div>
</div>
