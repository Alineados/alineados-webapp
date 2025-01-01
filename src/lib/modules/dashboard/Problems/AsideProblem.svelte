<script lang="ts">
	import DaysLeft from '$lib/components/DaysLeft.svelte';
	import ImagesCarousel from '$lib/components/ImagesCarousel.svelte';
	import ProgressCircle from '$lib/components/ProgressCircle.svelte';
	import RectangularCard from '$lib/components/RectangularCard.svelte';

	import Image from '$lib/icons/Image.svelte';
	import Upload from '$lib/icons/Upload.svelte';

	import { problemCard, problemProgress } from '$lib/stores';
	import { calculateDaysLeft, calculateDaysBetween, formatDate } from '$lib/utils/dates';
	import { onMount } from 'svelte';

	let daysCompleted = $state(0);
	onMount(() => {
		if ($problemCard.completed_at) {
			daysCompleted = calculateDaysBetween($problemCard.completed_at, $problemCard.milestone_date);
		}
	});
</script>

<div class="flex w-2/3 flex-col  gap-3">
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
				<p class="text-sm font-medium text-alineados-gray-900">Fecha meta</p>
				<p class="text-xs font-medium text-alineados-gray-600">
					{formatDate($problemCard.milestone_date)}
				</p>
				{#if !$problemCard.completed_at}
					<DaysLeft
						targetDate={$problemCard.milestone_date}
						color={calculateDaysLeft($problemCard.milestone_date) <= 10
							? 'red-500'
							: 'alineados-gray-400'}
						textSize="xs"
						extendedText={!(calculateDaysLeft($problemCard.milestone_date) <= 10)}
					/>
				{/if}
			</div>
		{/snippet}
		{#snippet rightContent()}
			<div class="flex w-full flex-col items-center justify-center">
				<ProgressCircle bind:progress={$problemProgress} />
			</div>
		{/snippet}
	</RectangularCard>
	{#if $problemCard.completed_at && $problemCard.progress === 100}
		<RectangularCard contentClass="w-full">
			{#snippet leftContent()}
				<div class="flex w-full flex-col items-center justify-center gap-1">
					<p class="text-sm font-medium text-alineados-gray-900">Fecha finalización</p>
					<p class="text-xs font-medium text-alineados-gray-600">
						{formatDate($problemCard.completed_at!)}
					</p>
				</div>
			{/snippet}
			{#snippet rightContent()}
				<div class="flex w-full flex-col items-center justify-center">
					<p class="text-xs font-medium text-alineados-gray-600">
						Has completado este problema en
						<span class="text-alineados-green-900"
							>{daysCompleted} {daysCompleted === 1 ? 'día!' : 'días!'}</span
						>
					</p>
				</div>
			{/snippet}
		</RectangularCard>
	{/if}
</div>
