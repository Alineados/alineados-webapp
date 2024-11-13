<script lang="ts">
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';
	import * as Select from '$lib/shared/ui/select/index';

	export let label: string = 'Celular';
	export let name: string;
	export let options: { value: string; label: string }[] = [];
	export let value: string = '';
	export let placeholder: string = 'Select an option';
	export let inputPlaceholder: string = 'Enter your phone number';
	export let isLoading: boolean = false;
	export let isOptional: boolean = false;

	// Derived content for the trigger
	$: triggerContent = options.find((option) => option.value === value)?.label ?? placeholder;
</script>

<div class="w-1/2 space-y-2">
	<Label class="text-lg font-semibold text-black" for={name}>
		{label}
		{#if isOptional}<span class="text-xs font-medium">(Opcional)</span>{/if}
	</Label>
	<div class="flex">
		<Select.Root type="single" {name} bind:value>
			<Select.Trigger
				class="w-1/6 border-white bg-[#0F172A] text-alineados_gray-900 focus:outline-none focus:ring-2 focus:ring-alineados_gray-100 data-[placeholder]:text-white"
			>
				{triggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group class="bg-alineados_gray-100">
					<Select.GroupHeading>{label}</Select.GroupHeading>
					{#each options as option}
						<Select.Item
							class="default-text bg-alineados_gray-50"
							value={option.value}
							label={option.label}
						>
							{option.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>

		<Input
			class="rounded-lg border-alineados_gray-100 bg-alineados_gray-50 placeholder:text-alineados_gray-500"
			id={name}
			type="tel"
			placeholder={inputPlaceholder}
			autocapitalize="none"
			autocorrect="off"
			disabled={isLoading}
		/>
	</div>
</div>
