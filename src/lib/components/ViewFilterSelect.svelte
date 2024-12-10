<script lang="ts">
	import * as Select from '$lib/shared/ui/select/index';

	let { name, options, placeholder, isAll = false } = $props();

	let value = $state('');

	const triggerContent = $derived.by(() => {
		for (const optionGroup of options) {
			const foundItem = optionGroup.items.find((item: any) => item.id === value);
			if (foundItem) {
				return foundItem.label;
			}
		}
		return placeholder;
	});

	$inspect({ value });
</script>

<div class="w-1/2 space-y-2">
	<Select.Root type="single" {name} bind:value>
		<Select.Trigger
			class="w-full border-alineados-gray-100  text-alineados-gray-700 focus:outline-none focus:ring-2 focus:ring-alineados-gray-100 data-[placeholder]:text-alineados-gray-700"
		>
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			{#if isAll}
				<Select.Item class="bg-white" value="all" label="Seleccionar todos">
					Seleccionar todos
				</Select.Item>
			{/if}

			{#each options as optionGroup}
				<Select.Group class="bg-alineados-gray-50">
					<Select.GroupHeading>{optionGroup.label}</Select.GroupHeading>
					{#each optionGroup.items as option}
						<Select.Item class="bg-white" value={option.id} label={option.label}>
							{option.label}
						</Select.Item>
					{/each}
				</Select.Group>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
