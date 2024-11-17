<script lang="ts">
	import CustomCard from '$lib/components/CustomCard.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Padlock from '$lib/icons/Padlock.svelte';
	import PillarHeader from '$lib/modules/dashboard/Pillars/PillarHeader.svelte';
</script>

<PillarHeader />

<div class="flex flex-col gap-3">
	<p class="text-xl font-bold text-alineados-gray-600">Salud</p>
	<div class="flex flex-row flex-wrap gap-3">
		{#each Array(2) as _, i}
			<CustomCard state="default" headerClass="justify-start">
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
					<div class="flex flex-col gap-4 pt-4">
						<p class="text-xl font-semibold text-black">Estoy procrastinando mucho</p>
						<div class="flex flex-col gap-1">
							<p class="text-xs font-semibold text-alineados-gray-200">Progreso de tareas</p>
							<ProgressBar state="default" progress={40} />
						</div>
					</div>
				{/snippet}
				{#snippet footer()}
					<div class="flex flex-row ">
						<p class="text-xs font-medium text-alineados-gray-400">90 días</p>
					</div>
				{/snippet}
			</CustomCard>
		{/each}
	</div>
</div>
<!-- <div class="flex flex-col">
	<p class="flex flex-row text-sm font-medium text-alineados-gray-600">
		Mis Problemas /
		<span class="text-orange-600"> Nombre Identificado</span>
	</p>
	<div class="flex flex-row   justify-between">
		<div class="flex flex-row gap-6">
			<p class="text-5xl font-bold text-alineados-blue-900">Nombre Identificado</p>
			<div class="flex flex-row items-center justify-start gap-4">
				<Padlock />
				<StatusPill status="active" />
			</div>
		</div>
		<div class="flex flex-row gap-4">
      <NewProblemButton />
      <ViewButton />
		</div>
	</div>
</div> -->
