<script lang="ts">
	import DaysLeft from '$lib/components/DaysLeft.svelte';
	import ImagesCarousel from '$lib/components/ImagesCarousel.svelte';
	import ProgressCircle from '$lib/components/ProgressCircle.svelte';
	import RectangularCard from '$lib/components/RectangularCard.svelte';

	import Image from '$lib/icons/Image.svelte';
	import Upload from '$lib/icons/Upload.svelte';
</script>

<div class="flex w-2/3 flex-col items-center justify-center gap-3">
	<div class="flex w-full justify-between px-2">
		<div class="flex w-full items-center gap-1">
			<Image styleTw="size-5" />
			<p class="text-base font-medium text-alineados-gray-600">Recuerdos</p>
		</div>
		<button>
			<Upload styleTw="size-5 text-alineados-gray-600 hover:text-alineados-gray-900" />
		</button>
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
