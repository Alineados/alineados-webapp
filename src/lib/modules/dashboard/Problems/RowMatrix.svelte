<script lang="ts">
	import type { Selector } from '$lib/interfaces';
	import * as Select from '$lib/shared/ui/select/index';
	import { getSelectorList, matrix } from '$lib/stores';

	let {
		color = 'alineados-blue-900',
		name = $bindable(),
		key = $bindable(),
		units = $bindable(),
		percentage = $bindable(),
		onChange,
	}: {
		color?: string;
		name: string;
		key: string;
		units: string;
		percentage: number;
		onChange?: () => void;
	} = $props();

	let filterSelector = $derived.by(() => {
		// return a list of selectors but filtered by the keys not used
		const listSelectors = getSelectorList($matrix.rows);
		// now filter the list from the keys already used and set disabled to true
		let newFilter = listSelectors.map((item: Selector) => {
			const found = $matrix.rows.find((row) => row.key === item.key);
			if (found) return { ...item, disabled: true };
			else return item;
		});

		// check if all the keys are used, if so, enable all the selectors
		const allUsed = newFilter.every((item) => item.disabled === true);
		if (allUsed) newFilter = newFilter.map((item) => ({ ...item, disabled: false }));

		return newFilter 
	});
</script>

<div class="flex items-center justify-start">
	<div class="flex w-2/3 flex-col justify-start gap-2">
		<span class="text-base">
			{name}
		</span>
		<Select.Root
			onValueChange={(e) => {
				const list = getSelectorList($matrix.rows);
				const foundSelector = list.find((item: Selector) => item.key === e);
				if (foundSelector?.key === e) percentage = foundSelector.value
				else percentage = 0; 
				
				
				onChange && onChange();
			}}
			type="single"
			name="importance"
			bind:value={key}
		>
			<Select.Trigger
	
				class="h-fit w-9/12 rounded-md border border-alineados-gray-200 bg-alineados-gray-50 px-1 py-1 text-left text-xs  text-alineados-gray-900"
			>
				{key === '' ? 'Importancia' : key}
			</Select.Trigger>
			<Select.Content class="bg-white text-alineados-blue-900 ">
				{#each filterSelector as item}
					<Select.Item disabled={item.disabled} value={item.key} class="text-xs">
						{item.key}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex w-1/3 flex-col items-center gap-1">
		<input class=" text-center text-xs outline-none {color}" bind:value={units} />
	</div>
</div>
