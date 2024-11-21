<script lang="ts">
	import Plus from '$lib/icons/Plus.svelte';
	import type { PillarItems } from '$lib/interfaces';
	import * as DropdownMenu from '$lib/shared/ui/dropdown-menu/index.js';

	let {
		handleSelectedPillar
	}: {
		handleSelectedPillar: (item: PillarItems) => void;
	} = $props();

	const listItems: PillarItems[] = [
		{ name: 'Salud', value: 1 },
		{ name: 'Relación', value: 2 },
		{ name: 'Vocación', value: 3 },
		{ name: 'Espiritual', value: 4 }
	];
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="group flex  items-center gap-[6px] rounded-lg bg-alineados-blue-900 px-4 py-[10px] text-white transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:bg-[#1A2642] hover:shadow-lg hover:shadow-[#0F172A]/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#0F172A]"
		aria-label="Nuevo"
	>
		<Plus width={13} height={13} />
		<p class="text-xs font-medium">Nuevo</p>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="bg-alineados-gray-100">
		<DropdownMenu.Group>
			{#each listItems as item}
				<DropdownMenu.Item
					class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
					onclick={() => {
						handleSelectedPillar(item);
					}}
				>
					<span class="font-normal">{item.name}</span>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
<!-- <button
	class="group flex items-center gap-[6px] rounded-lg bg-[#0F172A] px-4 py-[10px] text-white transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:bg-[#1A2642] hover:shadow-lg hover:shadow-[#0F172A]/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#0F172A]"
	aria-label="Crear nuevo problema"
>

</button> -->
