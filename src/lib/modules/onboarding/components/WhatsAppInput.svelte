<script lang="ts">
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';
	import * as Select from '$lib/shared/ui/select/index';
	import { Checkbox } from '$lib/shared/ui/checkbox/index';

	export let label: string = 'WhatsApp';
	export let name: string;
	export let options: { value: string; label: string; flag: string }[] = [];
	export let value: string = '';
	export let placeholder: string = 'Select an option';
	export let isChecked: boolean = false;
	export let checkboxLabel: string = 'Mismo que celular';

	// Derived content for the trigger
	$: selectedOption = options.find((option) => option.value === value);
	$: triggerContent = selectedOption?.label ?? placeholder;
	$: triggerFlag = selectedOption?.flag ?? '';
</script>

<div class="w-1/2 space-y-2">
	<!-- Label -->
	<div class="flex items-center justify-between">
		<Label class="text-lg font-semibold text-black" for={name}>
			{label}
		</Label>
		<div class="flex items-center space-x-2">
			<Checkbox
				id="terms"
				bind:checked={isChecked}
				aria-labelledby="terms-label"
				class="h-3 w-3 rounded border-gray-300 text-green-500 focus:ring-green-500"
				checkSize="h-3 w-3"
			/>
			<Label id="terms-label" for="terms" class="text-xs font-medium text-alineados-gray-600">
				{checkboxLabel}
			</Label>
		</div>
	</div>

	<div class="flex">
		<!-- Select to code -->
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
							class="bg-alineados-gray-50 text-base "
							value={option.value}
							label={option.label}
						>
							<div class="flex items-center gap-1">
								<img class="size-7" src={option.flag} alt={option.label} />
								<span class="text-base">{option.value}</span>
							</div>
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>

		<!-- Input to the number -->
		<Input
			class="w-1/6 rounded-lg border-alineados-gray-100 bg-alineados-gray-50 text-center text-base placeholder:text-alineados-gray-500"
			id={name}
			type="tel"
			autocapitalize="none"
			autocorrect="off"
			placeholder="+000"
			bind:value
		/>
		<Input
			class="rounded-lg border-alineados-gray-100 bg-alineados-gray-50 text-base placeholder:text-alineados-gray-500"
			id={name}
			type="tel"
			placeholder="Ingrese su número de WhatsApp"
			autocapitalize="none"
			autocorrect="off"
		/>
	</div>
</div>
