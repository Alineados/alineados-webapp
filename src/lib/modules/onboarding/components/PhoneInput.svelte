<script lang="ts">
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';
	import * as Select from '$lib/shared/ui/select/index';

	export let label: string = 'Celular';
	export let name: string;
	export let options: { value: string; label: string; flag: string }[] = [];
	export let value: string = '';
	export let placeholder: string = 'Select an option';
	export let inputPlaceholder: string = 'Enter your phone number';
	export let isOptional: boolean = false;

	// Derived content for the trigger
	$: selectedOption = options.find((option) => option.value === value);
	$: triggerContent = selectedOption?.label ?? placeholder;
	$: triggerFlag = selectedOption?.flag ?? '';
</script>

<div class="w-1/2 space-y-2">
	<Label class="text-lg font-semibold text-black" for={name}>
		{label}
		{#if isOptional}<span class="text-xs font-medium">(Opcional)</span>{/if}
	</Label>
	<div class="flex">
		<Select.Root type="single" {name} bind:value>
			<Select.Trigger
				class="select-trigger w-1/6 border-white bg-[#0F172A] text-alineados-gray-100 focus:outline-none focus:ring-2 focus:ring-alineados-gray-100 data-[placeholder]:text-white"
			>
				{#if triggerContent === placeholder}
					{placeholder}
				{:else}
					<img class="size-6" src={triggerFlag} alt={triggerContent} />
				{/if}
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
							<div class="flex items-center gap-1">
								<img class="size-7" src={option.flag} alt={option.label} />
								<span class="text-xl-">{option.value}</span>
							</div>
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>

		<Input
			class="w-1/6 rounded-lg border-alineados-gray-100 bg-alineados-gray-50 placeholder:text-alineados-gray-500"
			id={name}
			type="tel"
			autocapitalize="none"
			autocorrect="off"
			bind:value
		/>
		<Input
			class="rounded-lg border-alineados-gray-100 bg-alineados-gray-50 placeholder:text-alineados-gray-500"
			id={name}
			type="tel"
			placeholder={inputPlaceholder}
			autocapitalize="none"
			autocorrect="off"
		/>
	</div>
</div>
