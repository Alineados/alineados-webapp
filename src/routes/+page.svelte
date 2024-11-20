<script lang="ts">
	import AccountabilityButton from '$lib/components/AccountabilityButton.svelte';
	import CardFilter from '$lib/components/CardFilter.svelte';
	import CustomCard from '$lib/components/CustomCard.svelte';
	import DaysLeft from '$lib/components/DaysLeft.svelte';
	import HistoricalButton from '$lib/components/HistoricalButton.svelte';
	import HistoryButton from '$lib/components/HistoryButton.svelte';
	import Item from '$lib/components/Item.svelte';
	import MoreButton from '$lib/components/MoreButton.svelte';
	import NewProblem from '$lib/components/NewProblemButton.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import SelectablePill from '$lib/components/SelectablePill.svelte';
	import StatusPill from '$lib/components/StatusPill.svelte';
	import ViewButton from '$lib/components/ViewButton.svelte';

	let items = ['Salud Física', 'Salud Mental', 'Relación Propia', 'Relación Familiar'];
</script>

<div class="p-3 mb-8">
	<h1>Alineados :D</h1>
	<h2>Componentes:</h2>

	<div class="mt-4 flex gap-2">
		<ViewButton />
		<HistoricalButton />
	</div>
	<div class="mt-4 flex gap-2">
		<StatusPill status="active" />
		<StatusPill status="inactive" />
	</div>
	<div class="mt-4 flex gap-2">
		<CardFilter text="Todos" selected={true} type="simple" />
		<CardFilter text="Activos" type="simple" />
		<CardFilter text="No Activos" type="simple" />
	</div>
	<div class="mt-4 flex gap-4">
		<CustomCard headerClass="justify-start">
			{#snippet header()}
				<div>Header</div>
			{/snippet}
			{#snippet content()}
				<div>Content</div>
			{/snippet}
			{#snippet footer()}
				<div>Footer</div>
			{/snippet}
		</CustomCard>
		<CustomCard state="stable" headerClass="justify-start">
			{#snippet header()}
				<div>Header</div>
			{/snippet}
			{#snippet content()}
				<div>Content</div>
			{/snippet}
			{#snippet footer()}
				<div>Footer</div>
			{/snippet}
		</CustomCard>
		<CustomCard state="warning" headerClass="justify-start">
			{#snippet header()}
				<div>Header</div>
			{/snippet}
			{#snippet content()}
				<div>Content</div>
			{/snippet}
			{#snippet footer()}
				<div>Footer</div>
			{/snippet}
		</CustomCard>
		<CustomCard state="danger" headerClass="justify-start">
			{#snippet header()}
				<div>Header</div>
			{/snippet}
			{#snippet content()}
				<div>Content</div>
			{/snippet}
			{#snippet footer()}
				<div>Footer</div>
			{/snippet}
		</CustomCard>
		<CustomCard headerClass="justify-start" isNew>
			{#snippet header()}
				<div>Header</div>
			{/snippet}
			{#snippet content()}
				<div>Content</div>
			{/snippet}
			{#snippet footer()}
				<div>Footer</div>
			{/snippet}
		</CustomCard>
	</div>
	<div class="mt-4 flex gap-4">
		<ProgressBar progress={42} state="stable" />
		<ProgressBar progress={50} state="stable" />
		<ProgressBar progress={60} state="warning" />
		<ProgressBar progress={80} state="danger" />
	</div>
	<div class="mt-4 flex gap-2">
		<DaysLeft targetDate="2024-12-31" color="alineados-gray-400" />
		<DaysLeft targetDate="2024-11-31" color="green-400" extendedText />
	</div>
	<div class="mt-4 flex gap-4">
		<HistoryButton />
		<AccountabilityButton />
		<MoreButton />
	</div>
	<div class="mt-4 flex gap-2">
		<CardFilter text="Relaciones" selected={true} type="complex" />
		<CardFilter text="Salud" type="complex" />
		<CardFilter text="Espiritualidad" type="complex" />
	</div>
	<div class="mt-4">
		<SelectablePill text="Hola"/>
	</div>

	<div class="mt-4 flex w-2/3 flex-col gap-4">
		<Item />
		<Item isAccountability />
	</div>
</div>
