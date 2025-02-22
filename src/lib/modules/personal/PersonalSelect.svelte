<script lang="ts">
	import type { DataPillar, DataPurpose } from '$lib/interfaces';

	import * as Select from '$lib/shared/ui/select/index';
	import { onMount } from 'svelte';

	let {
		list,
		subCategory = false,
		alreadyValue = '',
		handleSelect
	}: {
		list: DataPillar[] | DataPurpose[];
		subCategory?: boolean;
		alreadyValue?: string;
		handleSelect: (value: string) => void;
	} = $props();

	let value = $state('');

	// Type guard to check if item is DataPillar
	function isDataPillar(item: DataPillar | DataPurpose): item is DataPillar {
		return 'categories' in item;
	}

	const triggerContent = $derived.by(() => {
		if (subCategory && list.length > 0 && isDataPillar(list[0])) {
			const getFather = (list as DataPillar[]).find((f) => f.name === value.split('-')[0]);
			return (
				getFather?.categories.find((f) => f.name === value.split('-')[1])?.label ??
				'Seleccione una opción'
			);
		} else {
			return list.find((f) => f.name === value)?.label ?? 'Seleccione una opción';
		}
	});
</script>

<Select.Root type="single" name="favoriteFruit" bind:value onValueChange={handleSelect}>
	<Select.Trigger class="w-6/12 border-alineados-gray-100">
		{alreadyValue !== '' ? alreadyValue : triggerContent}
	</Select.Trigger>
	<Select.Content class="bg-white">
		{#if subCategory}
			{#each list as data}
				<Select.Group>
					<Select.GroupHeading class="text-sm font-semibold  text-alineados-gray-900">
						{data.label}</Select.GroupHeading
					>
					{#each (data as DataPillar).categories as subdata}
						<Select.Item
							class="text-xs font-medium text-alineados-gray-700 data-[highlighted]:text-alineados-green-900"
							value={`${data.name}-${subdata.name}-${data.id}-${subdata.id}`}
							label={subdata.label}>{subdata.label}</Select.Item
						>
					{/each}
				</Select.Group>
			{/each}
			<Select.Separator />
		{:else}
			<Select.Group>
				<Select.GroupHeading class="text-xs font-semibold text-alineados-gray-600"
					>Seleccione una opción</Select.GroupHeading
				>
				{#each list as data}
					<Select.Item
						class="text-sm font-medium text-alineados-gray-900 data-[highlighted]:text-alineados-green-900"
						value={data.name}
						label={data.label}>{data.label}</Select.Item
					>
				{/each}
			</Select.Group>
		{/if}
	</Select.Content>
</Select.Root>
