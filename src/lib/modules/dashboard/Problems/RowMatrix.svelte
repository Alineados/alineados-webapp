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
		allPrioritiesSet = false,
	}: {
		color?: string;
		name: string;
		key: string;
		units: string;
		percentage: number;
		onChange?: () => void;
		allPrioritiesSet?: boolean;
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

	const unitOptions = [
		'kg', 'libras', 'días', 'GTQ', 'USD', 'horas', 'minutos', 'puntos', 'veces', '%', 'metros', 'cm', 'mm', 'litros', 'unidades'
	];
	let customUnit = '';
	let showUnitDropdown = $state(false);
	let inputValue = $state('');
	let tooltipText = '';
	let tooltipVisible = $state(false);
	let tooltipPosition = $state({ x: 0, y: 0 });

	function showTooltip(event: MouseEvent, text: string) {
		tooltipText = text;
		tooltipPosition = { x: event.clientX, y: event.clientY };
		tooltipVisible = true;
	}

	function hideTooltip() {
		tooltipVisible = false;
	}

	function truncateObjectiveName(text: string): string {
		if (text.length <= 28) {
			return text;
		}
		return text.substring(0, 28) + '...';
	}
</script>

<div class="flex items-center justify-start">
	<div class="flex w-2/3 flex-col justify-start gap-2">
		<span 
			class="text-base cursor-help whitespace-nowrap"
			on:mouseenter={(e) => showTooltip(e, name)}
			on:mouseleave={hideTooltip}
		>
			{truncateObjectiveName(name)}
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
	
				class="h-fit w-9/12 rounded-md border px-1 py-1 text-left text-xs text-alineados-gray-900 bg-alineados-gray-50 {key === '' ? 'border-orange-500 animate-border-cursor-blink' : 'border-alineados-gray-200'}"
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
		<div class="relative mt-8">
			<input
				class="text-left text-xs outline-none w-32 rounded-md border px-1 py-1 {color} {allPrioritiesSet && units === '' ? 'border-orange-500 animate-border-cursor-blink' : 'border-alineados-gray-200'} bg-alineados-gray-50"
				bind:value={units}
				placeholder="Unidad de medida"
				disabled={!allPrioritiesSet}
				on:focus={() => showUnitDropdown = true}
				on:blur={() => setTimeout(() => showUnitDropdown = false, 200)}
			/>
			{#if showUnitDropdown && allPrioritiesSet}
				<div class="absolute top-full left-0 z-10 mt-1 w-32 rounded-md border border-alineados-gray-200 bg-white shadow-lg">
					{#each unitOptions as option}
						<button
							class="block w-full px-3 py-1 text-left text-xs text-alineados-gray-700 hover:bg-alineados-gray-100"
							on:click={() => {
								units = option;
								showUnitDropdown = false;
							}}
						>
							{option}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Tooltip personalizado para objetivos -->
{#if tooltipVisible}
	<div 
		class="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2"
		style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px;"
	>
		{tooltipText}
		<!-- Flecha del tooltip -->
		<div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
	</div>
{/if}

<style>
.animate-border-cursor-blink {
  animation: border-cursor-blink 1.3s steps(1) infinite;
}
@keyframes border-cursor-blink {
  0%, 100% { border-color: rgb(249 115 22); }
  50% { border-color: transparent; }
}
</style>
