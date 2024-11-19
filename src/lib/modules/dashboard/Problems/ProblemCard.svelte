<script lang="ts">
	import CustomCard from '$lib/components/CustomCard.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Padlock from '$lib/icons/Padlock.svelte';

	let {
		title,
		length
	}: {
		title: string;
		length: number;
	} = $props();
</script>

<div class="flex flex-col gap-3 items-start">
	<p class="text-xl font-bold text-alineados-gray-600 pl-2 md:pl-1">{title}</p>
	<div class="flex flex-row w-full flex-wrap justify-center md:justify-start gap-3">
		{#each Array(length) as _, i}
			<CustomCard  state="default" headerClass="justify-start">
				{#snippet header()}
					<div class="flex flex-row items-center gap-1">
						<span
							class="rounded-lg bg-alineados-green-100 px-2 py-1 text-xs font-semibold text-alineados-green-900"
							>Activo</span
						>
						<Padlock class="size-4" />
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
					<div class="flex flex-row">
						<p class="text-xs font-medium text-alineados-gray-400">90 días</p>
					</div>
				{/snippet}
			</CustomCard>
		{/each}
	</div>
</div>
