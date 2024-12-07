<script lang="ts">
	import { Label } from '$lib/shared/ui/label/index';
	import * as Select from '$lib/shared/ui/select/index';

	export let label: string;
	export let name: string;
	export let options: { value: string; label: string }[] = [];
	export let value: string = '';
	export let placeholder: string = 'Select an option';

	// Derived content for the trigger
	$: triggerContent = options.find((option) => option.value === value)?.label ?? placeholder;
</script>

<div class="w-1/2 space-y-2">
	<Label class="text-lg font-semibold text-black" for={name}>{label}</Label>

	<Select.Root type="single" {name} bind:value>
		<Select.Trigger
			class="w-full border-alineados-gray-100 bg-alineados-gray-50 text-base text-alineados-gray-900 focus:outline-none focus:ring-2 focus:ring-alineados-gray-100 data-[placeholder]:text-alineados-gray-500"
		>
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group class="bg-alineados-gray-100">
				<Select.GroupHeading>{label}</Select.GroupHeading>
				{#each options as option}
					<Select.Item
						class="default-text bg-alineados-gray-50"
						value={option.value}
						label={option.label}
					>
						{option.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
