<script lang="ts">
	import type { OnboardingValidation, RegisterValidation } from '$lib/interfaces/onbarding';
	import { Label } from '$lib/shared/ui/label/index';
	import * as Select from '$lib/shared/ui/select/index';
	import { RegisterValidationType } from '$lib/interfaces/onbarding';

	// Props
	let {
		inputKey,
		value = $bindable(),
		validation = $bindable()
	}: {
		inputKey: string;
		value: string;
		validation: OnboardingValidation;
	} = $props();

	// States
	let label = $state('Fecha de Nacimiento');
	let day = $state('');
	let month = $state('');
	let year = $state('');

	// Derived
	let keyString = $derived(inputKey) as keyof RegisterValidation;

	// Days
	const days = Array.from({ length: 31 }, (_, i) => {
		const day = `${i + 1}`.padStart(2, '0');
		return { value: day, label: day };
	});

	// Months
	const months = [
		{ value: '01', label: '01 - Enero' },
		{ value: '02', label: '02 - Febrero' },
		{ value: '03', label: '03 - Marzo' },
		{ value: '04', label: '04 - Abril' },
		{ value: '05', label: '05 -Mayo' },
		{ value: '06', label: '06 Junio' },
		{ value: '07', label: '07 - Julio' },
		{ value: '08', label: '08 - Agosto' },
		{ value: '09', label: '09 - Septiembre' },
		{ value: '10', label: '10 - Octubre' },
		{ value: '11', label: '11 - Noviembre' },
		{ value: '12', label: '12 - Diciembre' }
	];

	// Years
	const years = Array.from({ length: 100 }, (_, i) => ({
		value: `${2023 - i}`,
		label: `${2023 - i}`
	}));

	// Create reactive statement for combined date
	$effect(() => {
		if (day && month && year) {
			// Reguired validation
			Object.keys(validation.register).forEach((key) => {
				if (key === inputKey) {
					validation.register[keyString].isWrong = false;
					validation.register[keyString].errorType = RegisterValidationType.ALL_GOOD;
				}
			});

			value = `${year}-${month}-${day}`; // YYYY-MM-DD format
		} else {
			value = '';
		}
	});
</script>

<div class="relative flex w-1/2 flex-col gap-1">
	<Label class="text-lg font-semibold text-black" for="date-select">{label}</Label>

	<div class="flex">
		<Select.Root type="single" name="day" bind:value={day}>
			<Select.Trigger
				class="w-1/3 justify-center border-alineados-gray-100 bg-alineados-gray-50 text-base text-alineados-gray-500 focus:outline-none focus:ring-2 focus:ring-alineados-gray-100 data-[placeholder]:text-alineados-gray-500"
				showIcon={false}
			>
				{day || 'DD'}
			</Select.Trigger>
			<Select.Content>
				<Select.Group class="bg-alineados-gray-100">
					<Select.GroupHeading>Día</Select.GroupHeading>
					{#each days as day}
						<Select.Item
							class="default-text bg-alineados-gray-50"
							value={day.value}
							label={day.label}
						>
							{day.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
		<Select.Root type="single" name="month" bind:value={month}>
			<Select.Trigger
				class="w-1/3 justify-center border-alineados-gray-100 bg-alineados-gray-50 text-base text-alineados-gray-500 focus:outline-none focus:ring-2 focus:ring-alineados-gray-100 data-[placeholder]:text-alineados-gray-500"
				showIcon={false}
			>
				{month || 'MM'}
			</Select.Trigger>
			<Select.Content>
				<Select.Group class="bg-alineados-gray-100">
					<Select.GroupHeading>Mes</Select.GroupHeading>
					{#each months as month}
						<Select.Item
							class="default-text bg-alineados-gray-50"
							value={month.value}
							label={month.label}
						>
							{month.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
		<Select.Root type="single" name="year" bind:value={year}>
			<Select.Trigger
				class="w-1/3 justify-center border-alineados-gray-100 bg-alineados-gray-50 text-base text-alineados-gray-500 focus:outline-none focus:ring-2 focus:ring-alineados-gray-100 data-[placeholder]:text-alineados-gray-500"
				showIcon={false}
			>
				{year || 'AAAA'}
			</Select.Trigger>
			<Select.Content>
				<Select.Group class="bg-alineados-gray-100">
					<Select.GroupHeading>Año</Select.GroupHeading>
					{#each years as year}
						<Select.Item
							class="default-text bg-alineados-gray-50"
							value={year.value}
							label={year.label}
						>
							{year.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	{#if validation.register[keyString].isWrong}
		<span class="absolute -bottom-3 left-1 text-xs text-[#C90404]" style="opacity: 1; height: 1em;">
			*campo requerido
		</span>
	{/if}
</div>
