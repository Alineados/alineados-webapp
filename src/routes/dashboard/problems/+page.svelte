<script lang="ts">
	import type { PillarItems } from '$lib/interfaces';
	import PillarHeader from '$lib/modules/dashboard/Problems/PillarHeader.svelte';
	import ProblemCard from '$lib/modules/dashboard/Problems/ProblemCard.svelte';

	function handleSelectedPillar(item: PillarItems) {
		console.log('Selected from parent	 -> ', item);
	}
</script>

<div class="sticky top-0 z-10 w-full bg-white">
	<PillarHeader {handleSelectedPillar} />
</div>

<div class="flex flex-col gap-12 pb-12">
	<ProblemCard title="Salud" length={3} />
	<ProblemCard title="Relación" length={3} />
	<ProblemCard title="Vocación" length={5} />
	<ProblemCard title="Espiritual" length={1} />
</div>
