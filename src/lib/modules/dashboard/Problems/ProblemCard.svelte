<script lang="ts">
	import CustomCard from '$lib/components/CustomCard.svelte';
	import DaysLeft from '$lib/components/DaysLeft.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Padlock from '$lib/icons/Padlock.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';

	let {
		title,
		length
	}: {
		title: string;
		length: number;
	} = $props();
</script>

<div class="flex flex-col items-start gap-3">
	<p class="pl-2 text-xl font-bold text-alineados-gray-600 md:pl-1">{title}</p>
	<div class="flex w-full flex-row flex-wrap justify-center gap-3 md:justify-start">
		{#each Array(length) as _, i}
			<CustomCard isNew={false} state="default" headerClass="justify-between">
				{#snippet header()}
					<div class="flex w-full flex-row items-center justify-between">
						<div class="flex flex-row items-center gap-1">
							<span
								class="rounded-lg bg-alineados-green-100 px-2 py-1 text-xs font-semibold text-alineados-green-900"
								>Activo</span
							>
							<Padlock class="size-4" />
						</div>
						<button class="rounded-lg p-2 hover:bg-gray-100" aria-label="Delete">
							<TrashCan width={18} height={18}  />
						</button>
					</div>
				{/snippet}
				{#snippet content()}
					<div class="flex flex-col gap-4 pb-3 pt-4">
						<p class="text-xl font-semibold text-black">Estoy procrastinando mucho</p>
						<div class="flex flex-col gap-1">
							<p class="text-xs font-semibold text-alineados-gray-200">Progreso de tareas</p>
							<ProgressBar progress={42} state="stable" />
						</div>
					</div>
				{/snippet}
				{#snippet footer()}
					<DaysLeft targetDate="2024-12-31" color="alineados-gray-400" />
				{/snippet}
			</CustomCard>
		{/each}
	</div>
</div>
