<script lang="ts">
	import DaysLeft from '$lib/components/DaysLeft.svelte';
	import ImagesCarousel from '$lib/components/ImagesCarousel.svelte';
	import ListDocuments from '$lib/components/ListDocuments.svelte';
	import ProgressCircle from '$lib/components/ProgressCircle.svelte';
	import RectangularCard from '$lib/components/RectangularCard.svelte';
	import Image from '$lib/icons/Image.svelte';
	import { problemCard, problemProgress } from '$lib/stores';
	import { calculateDaysLeft, calculateDaysBetween, formatDate } from '$lib/utils/dates';
	import { onMount } from 'svelte';

	let { openDateModal = $bindable() }: { openDateModal: boolean } = $props();

	let daysCompleted = $state(0);

	onMount(() => {
		if ($problemCard.completed_at) {
			// Usar la misma lógica que DaysPill para evitar NaN
			try {
				const completedDate = new Date($problemCard.completed_at);
				
				// Manejar el formato específico de created_at que viene del backend
				let createdDate;
				if ($problemCard.created_at.includes('+0000 UTC')) {
					// Formato: "2025-01-28 01:56:33.939477562 +0000 UTC"
					// Convertir a formato ISO estándar
					const cleanDate = $problemCard.created_at.replace(' +0000 UTC', 'Z');
					createdDate = new Date(cleanDate);
				} else {
					createdDate = new Date($problemCard.created_at);
				}
				
				// Verificar que las fechas sean válidas
				if (!isNaN(completedDate.getTime()) && !isNaN(createdDate.getTime())) {
					// Calcular diferencia en milisegundos
					const timeDiff = completedDate.getTime() - createdDate.getTime();
					// Convertir a días
					daysCompleted = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
					daysCompleted = Math.max(0, daysCompleted);
				} else {
					daysCompleted = 0;
				}
			} catch (error) {
				console.error('Error calculando días completados:', error);
				daysCompleted = 0;
			}
		}
	});
</script>

<div class="flex w-full flex-col gap-3">
	<div class="flex w-full justify-between px-2">
		<div class="flex items-center gap-1">
			<Image styleTw="size-5" />
			<p class="text-base font-medium text-alineados-gray-600">Recuerdos</p>
		</div>
	</div>
	<ImagesCarousel />
	<RectangularCard contentClass="w-full">
		{#snippet leftContent()}
			<div class="flex w-full flex-col items-center justify-center gap-1">
				<p class="text-sm font-medium text-alineados-gray-900">Fecha meta</p>
				<button
					disabled={!$problemCard.active}
					onclick={() => (openDateModal = !openDateModal)}
					class="flex w-full flex-row items-center justify-center gap-2"
				>
					<p class="text-xs font-medium text-alineados-gray-600">
						{formatDate($problemCard.milestone_date)}
					</p>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4 text-alineados-gray-500"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
						/>
					</svg>
				</button>

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

	<!-- Documents -->
	<ListDocuments bind:disabled={$problemCard.active} />
</div>
