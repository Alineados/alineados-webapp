<script lang="ts">
	import type { PillarItems } from '$lib/interfaces';
	import EditHeader from '$lib/modules/dashboard/Problems/EditHeader.svelte';
	import SelectablePill from '$lib/components/SelectablePill.svelte';
	import CardFilter from '$lib/components/CardFilter.svelte';
	import Image from '$lib/icons/Image.svelte';
	import RectangularCard from '$lib/components/RectangularCard.svelte';
	import DaysLeft from '$lib/components/DaysLeft.svelte';
	import ProgressCircle from '$lib/components/ProgressCircle.svelte';

	let {
		handleSelectedPillar
	}: {
		handleSelectedPillar: (item: PillarItems) => void;
	} = $props();

	// Filter items object state
	let cardFilter = $state<{ all: boolean; active: boolean; inactive: boolean }>({
		all: true,
		active: false,
		inactive: false
	});

	function changeFilter(filter: keyof typeof cardFilter) {
		cardFilter.all = false;
		cardFilter.active = false;
		cardFilter.inactive = false;

		cardFilter[filter] = true;
	}
</script>

<EditHeader />

<div class="flex w-full">
	<div class="w-7/12">
		<div class="flex flex-col gap-3 border-b border-alineados-gray-100">
			<div class="flex flex-row gap-2">
				<CardFilter
					type="complex"
					text="Relaciones"
					bind:selected={cardFilter.all}
					triggerFunction={() => {
						changeFilter('all');
					}}
				/>
				<CardFilter
					type="complex"
					text="Salud"
					bind:selected={cardFilter.active}
					triggerFunction={() => {
						changeFilter('active');
					}}
				/>
				<CardFilter
					type="complex"
					text="Espiritualidad"
					bind:selected={cardFilter.inactive}
					triggerFunction={() => {
						changeFilter('inactive');
					}}
				/>
			</div>

			<div class="flex flex-row gap-2 pb-4">
				<SelectablePill text="nombre #1" />
				<SelectablePill text="nombre #2" />
			</div>
		</div>
	</div>

	<div class="flex w-5/12 justify-center">
		<div class="flex w-2/3 flex-col items-center justify-center gap-3">
			<div class="flex w-full justify-start gap-1">
				<Image class="size-6" />
				<p class="text-lg font-medium text-alineados-gray-600">Recuerdos</p>
			</div>
			<div>Carrusel</div>
			<RectangularCard contentClass="w-full">
				{#snippet leftContent()}
					<div class="flex w-full flex-col items-center justify-center gap-1">
						<p class="text-sm font-medium text-gray-900">Fecha meta</p>
						<p class="text-xs font-medium text-gray-600">24/11/2024</p>
						<DaysLeft targetDate="2024-11-24" color="red-400" textSize="sm" extendedText />
					</div>
				{/snippet}
				{#snippet rightContent()}
					<div class="flex w-full flex-col items-center justify-center">
						<ProgressCircle progress={42} />
					</div>
				{/snippet}
			</RectangularCard>
		</div>
	</div>
</div>
