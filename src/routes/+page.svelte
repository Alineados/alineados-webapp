<script lang="ts">
	import AccountabilityButton from '$lib/components/AccountabilityButton.svelte';
	import CustomCard from '$lib/components/CustomCard.svelte';
	import HistoricalButton from '$lib/components/HistoricalButton.svelte';
	import HistoryButton from '$lib/components/HistoryButton.svelte';
	import NewProblem from '$lib/components/NewProblemButton.svelte';
	import SelectablePills from '$lib/components/SelectablePills.svelte';
	import StatusPill from '$lib/components/StatusPill.svelte';
	import ViewButton from '$lib/components/ViewButton.svelte';

	let items = ['Salud Física', 'Salud Mental', 'Relación Propia', 'Relación Familiar'];
</script>

<div class="p-3">
	<h1>Alineados :D</h1>
	<h2>Componentes:</h2>
	<div class="mt-4 flex gap-2">
		<NewProblem />
		<ViewButton />
		<HistoricalButton />
	</div>
	<div class="mt-4 flex gap-2">
		<StatusPill status="active" />
		<StatusPill status="inactive" />
	</div>
	<div class="mt-4">
		<SelectablePills {items} />
	</div>
	<div class="mt-4 flex gap-2">
		<HistoryButton />
		<AccountabilityButton />
	</div>
	<div class="mt-4 flex gap-4">
		<CustomCard />
		<CustomCard />
	</div>
</div>
