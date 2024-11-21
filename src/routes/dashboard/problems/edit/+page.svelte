<script lang="ts">
	import type { PillarItems } from '$lib/interfaces';
	import EditHeader from '$lib/modules/dashboard/Problems/EditHeader.svelte';
	import SelectablePill from '$lib/components/SelectablePill.svelte';
	import CardFilter from '$lib/components/CardFilter.svelte';
	import Image from '$lib/icons/Image.svelte';
	import RectangularCard from '$lib/components/RectangularCard.svelte';
	import DaysLeft from '$lib/components/DaysLeft.svelte';
	import ProgressCircle from '$lib/components/ProgressCircle.svelte';
	import ImagesCarousel from '$lib/components/ImagesCarousel.svelte';
	import Bolt from '$lib/icons/Bolt.svelte';
	import Item from '$lib/components/Item.svelte';

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

		<div class="mt-9 flex flex-col">
			<div class="flex items-center gap-1">
				<Bolt styleTw="size-6 text-alineados-gray-900" />
				<h2 class="text-2xl font-medium text-alineados-gray-900">Tomador de decisión</h2>
			</div>
			<div class="-ml-10 mt-5 flex flex-col gap-[6px]">
				<Item
					value="Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. "
				/>
				<Item
					value="Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. "
				/>
				<Item
					value="Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. "
				/>
				<Item isDisabled />
			</div>
		</div>
	</div>

	<div class="flex w-5/12 justify-center">
		<div class="flex w-2/3 flex-col items-center justify-center gap-3">
			<div class="flex w-full items-center justify-start gap-1">
				<Image class="size-5" />
				<p class="text-sm font-medium text-alineados-gray-600">Recuerdos</p>
			</div>
			<ImagesCarousel />
			<RectangularCard contentClass="w-full">
				{#snippet leftContent()}
					<div class="flex w-full flex-col items-center justify-center gap-1">
						<p class="text-sm font-medium text-gray-900">Fecha meta</p>
						<p class="text-xs font-medium text-gray-600">24/11/2024</p>
						<DaysLeft targetDate="2024-11-24" color="green-500" textSize="sm" extendedText />
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
