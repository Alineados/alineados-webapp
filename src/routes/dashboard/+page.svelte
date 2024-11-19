<script lang="ts">
	import PillarHeader from '$lib/modules/dashboard/Problems/PillarHeader.svelte';
	import ProblemCard from '$lib/modules/dashboard/Problems/ProblemCard.svelte';
</script>

<PillarHeader />

<div class="flex flex-col gap-12 pb-12">
	<ProblemCard title="Salud" length={3} />
	<ProblemCard title="Relación" length={3} />
	<ProblemCard title="Vocación" length={5} />
	<ProblemCard title="Espiritual" length={1} />
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
