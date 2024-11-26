<script lang="ts">
	import ArrowNumber from '$lib/components/ArrowNumber.svelte';
	import ViewCard from '$lib/components/ViewCard.svelte';
	import ViewFilterSelect from '$lib/components/ViewFilterSelect.svelte';
	import ViewTable from '$lib/components/ViewTable.svelte';
	import ArrowDown from '$lib/icons/ArrowDown.svelte';
	import ArrowUp from '$lib/icons/ArrowUp.svelte';
	import Hand from '$lib/icons/Hand.svelte';
	import ViewHeader from '$lib/modules/dashboard/Problems/ViewHeader.svelte';

	const options = [
		{ value: 'uno', label: 'Uno' },
		{ value: 'dos', label: 'Dos' },
		{ value: 'tres', label: 'Tres' }
	];
</script>

<div class="sticky top-0 z-10 w-full bg-white">
	<ViewHeader />
</div>

<div class="flex gap-12 pb-12">
	<ViewCard contentClass="w-full">
		{#snippet content()}
			<div class="flex w-full items-center gap-3 p-6">
				<div class="rounded-xl bg-alineados-green-50 p-4">
					<Hand styleTw="size-9 text-alineados-green-900" />
				</div>
				<div>
					<p class="text-base font-medium text-black">Total de Problemas</p>
					<p class="-mt-1 text-3xl font-semibold text-alineados-gray-800">242</p>
				</div>
			</div>
		{/snippet}
	</ViewCard>
	<ViewCard contentClass="w-full">
		{#snippet content()}
			<div class="flex w-full items-center justify-between gap-3 p-6">
				<div class="flex flex-col gap-3">
					<p class="text-sm font-medium text-black">Pilares con menos problemas</p>
					<div class="flex items-center gap-2">
						<div class="rounded-xl bg-alineados-green-50 p-2">
							<Hand styleTw="size-9 text-alineados-green-900" />
						</div>
						<div>
							<p class="text-xs font-medium text-alineados-gray-400">Pilar</p>
							<p class="-mt-1 text-2xl font-medium text-alineados-gray-800">Salud</p>
						</div>
					</div>
				</div>
				<div class="flex h-full items-end">
					<ArrowNumber>
						{#snippet arrow()}
							<ArrowDown styleTw="size-6 text-[#FB5B5B]" strokeWidth={2} />
						{/snippet}
					</ArrowNumber>
				</div>
			</div>
		{/snippet}
	</ViewCard>
	<ViewCard contentClass="w-full">
		{#snippet content()}
			<div class="flex w-full items-center justify-between gap-3 p-6">
				<div class="flex flex-col gap-3">
					<p class="text-sm font-medium text-black">Pilares con más problemas</p>
					<div class="flex items-center gap-2">
						<div class="rounded-xl bg-alineados-green-50 p-2">
							<Hand styleTw="size-9 text-alineados-green-900" />
						</div>
						<div>
							<p class="text-xs font-medium text-alineados-gray-400">Pilar</p>
							<p class="-mt-1 text-2xl font-medium text-alineados-gray-800">Salud</p>
						</div>
					</div>
				</div>
				<div class="flex h-full items-end">
					<ArrowNumber>
						{#snippet arrow()}
							<ArrowUp styleTw="size-6 text-[#0FC917]" strokeWidth={2} />
						{/snippet}
					</ArrowNumber>
				</div>
			</div>
		{/snippet}
	</ViewCard>
</div>

<div class="flex gap-12 pb-12">
	<ViewFilterSelect label="Pilares" name="pillars" {options} />
	<ViewFilterSelect label="Pilares" name="pillars" {options} />
	<ViewFilterSelect label="Pilares" name="pillars" {options} />
</div>

<div class="w-full">
	<ViewTable />
</div>
