<script lang="ts">
	import * as Select from '$lib/shared/ui/select/index';

	// Props
	let { name, criteria, value = $bindable() } = $props();

	const triggerContent = $derived(
		criteria.find((f: any) => f.criterion === value)?.label ?? 'Seleccione un criterio'
	);
</script>

<div class="w-1/2 space-y-2">
	<Select.Root type="single" {name} bind:value>
		<Select.Trigger
			class="w-full border-alineados-gray-100  text-alineados-gray-700 focus:outline-none focus:ring-2 focus:ring-alineados-gray-100 data-[placeholder]:text-alineados-gray-700"
		>
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group class="bg-alineados-gray-50">
				<Select.GroupHeading>Criterios</Select.GroupHeading>
				{#each criteria as item}
					<Select.Item class="bg-white" value={item.criterion} label={item.label}>
						{item.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
