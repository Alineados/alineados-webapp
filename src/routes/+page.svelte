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
	import ProgressCircle from '$lib/components/ProgressCircle.svelte';
	import RectangularCard from '$lib/components/RectangularCard.svelte';
	import SelectablePill from '$lib/components/SelectablePill.svelte';
	import StatusPill from '$lib/components/StatusPill.svelte';
	import ViewButton from '$lib/components/ViewButton.svelte';

	let items = ['Salud Física', 'Salud Mental', 'Relación Propia', 'Relación Familiar'];
</script>

<div class="mb-8 p-3">
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
		<ProgressBar progress={30} state="stable" />
		<ProgressBar progress={50} state="stable" />
		<ProgressBar progress={60} state="warning" />
		<ProgressBar progress={80} state="danger" />
	</div>
	<div class="mt-4 flex gap-2">
		<DaysLeft targetDate="2024-12-31" color="alineados-gray-400" />
		<DaysLeft targetDate="2024-11-31" color="red-400" extendedText />
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
	<div class="mt-4 flex gap-1">
		<SelectablePill text="nombre#1" selected />
		<SelectablePill text="nombre#2" />
	</div>
	<div class="mt-4 flex w-2/3 flex-col gap-4">
		<Item />
		<Item isAccountability />
	</div>
	<div class="mt-4 flex w-1/4 gap-4">
		<RectangularCard contentClass="gap-3 justify-between px-6 py-2">
			{#snippet leftContent()}
				<div>Left</div>
			{/snippet}
			{#snippet rightContent()}
				<div>Right</div>
			{/snippet}
		</RectangularCard>
	</div>
	<div class="f mt-4 flex gap-4">
		<ProgressCircle progress={0} />
		<ProgressCircle progress={25} />
		<ProgressCircle progress={50} />
		<ProgressCircle progress={75} />
		<ProgressCircle progress={100} />
	</div>
</div>
