<script lang="ts">
	import { Label } from '$lib/shared/ui/label/index';
	import * as Select from '$lib/shared/ui/select/index';

	export let label: string = 'Fecha de Nacimiento';
	export let day: string = '';
	export let month: string = '';
	export let year: string = '';

	/*
	export let onDayChange: (day: string) => void;
	export let onMonthChange: (month: string) => void;
	export let onYearChange: (year: string) => void;
	*/

	const days = Array.from({ length: 31 }, (_, i) => {
		const day = `${i + 1}`.padStart(2, '0');
		return { value: day, label: day };
	});

	const months = [
		{ value: '01', label: 'Enero' },
		{ value: '02', label: 'Febrero' },
		{ value: '03', label: 'Marzo' },
		{ value: '04', label: 'Abril' },
		{ value: '05', label: 'Mayo' },
		{ value: '06', label: 'Junio' },
		{ value: '07', label: 'Julio' },
		{ value: '08', label: 'Agosto' },
		{ value: '09', label: 'Septiembre' },
		{ value: '10', label: 'Octubre' },
		{ value: '11', label: 'Noviembre' },
		{ value: '12', label: 'Diciembre' }
	];
	const years = Array.from({ length: 100 }, (_, i) => ({
		value: `${2023 - i}`,
		label: `${2023 - i}`
	}));

	/*
	function handleDayChange(event) {
		day = event.detail;
		onDayChange(day);
	}

	function handleMonthChange(event) {
		month = event.detail;
		onMonthChange(month);
	}

	function handleYearChange(event) {
		year = event.detail;
		onYearChange(year);
	}
 
    */
</script>

<div class="w-1/2 space-y-2">
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
</div>
