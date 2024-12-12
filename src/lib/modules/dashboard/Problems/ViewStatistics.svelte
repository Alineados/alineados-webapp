<script lang="ts">
	import ArrowNumber from '$lib/components/ArrowNumber.svelte';
	import ViewCard from '$lib/components/ViewCard.svelte';
	import ArrowDown from '$lib/icons/ArrowDown.svelte';
	import ArrowUp from '$lib/icons/ArrowUp.svelte';
	import Hand from '$lib/icons/Hand.svelte';

	// Props
	let { pilars } = $props();

	// Calcule the total of problems
	let totalProblems = $derived.by(() => {
		return pilars.flatMap((pilar: any) => pilar.problems).length;
	});

	// Get the pilar with the most and least problems
	const pilarNameMap = {
		relationalID: 'Relación',
		healthID: 'Salud',
		spiritualID: 'Espiritual',
		vocationalID: 'Vocación'
	};

	let { maxPilarStats, minPilarStats } = $derived.by(() => {
		const pilarStats = pilars.reduce(
			(acc: any, pilar: { pilar_name: keyof typeof pilarNameMap; problems: any[] }) => {
				const problemCount = pilar.problems.length;

				if (!acc.max || problemCount > acc.max.count) {
					acc.max = {
						name: pilarNameMap[pilar.pilar_name] || pilar.pilar_name,
						count: problemCount
					};
				}

				if (!acc.min || problemCount < acc.min.count) {
					acc.min = {
						name: pilarNameMap[pilar.pilar_name] || pilar.pilar_name,
						count: problemCount
					};
				}

				return acc;
			},
			{ max: null, min: null }
		);

		return {
			maxPilarStats: pilarStats.max,
			minPilarStats: pilarStats.min
		};
	});
</script>

<ViewCard contentClass="w-full">
	{#snippet content()}
		<div class="flex w-full items-center gap-3 p-6">
			<div class="rounded-xl bg-alineados-green-50 p-4">
				<Hand styleTw="size-9 text-alineados-green-900" />
			</div>
			<div>
				<p class="text-base font-medium text-black">Total de Problemas</p>
				<p class="-mt-1 text-4xl font-semibold text-alineados-gray-800">{totalProblems}</p>
			</div>
		</div>
	{/snippet}
</ViewCard>
<ViewCard contentClass="w-full">
	{#snippet content()}
		<div class="flex w-full items-center justify-between gap-3 p-6">
			<div class="flex flex-col gap-3">
				<p class="text-sm font-medium text-black">Pilares con menos problemas</p>
				<div class="flex items-center gap-2">
					<div class="rounded-xl bg-alineados-green-50 p-2">
						<Hand styleTw="size-9 text-alineados-green-900" />
					</div>
					<div>
						<p class="text-xs font-medium text-alineados-gray-400">Pilar</p>
						<p class="-mt-1 text-xl font-medium text-alineados-gray-800">{minPilarStats.name}</p>
					</div>
				</div>
			</div>
			<div class="flex h-full items-end">
				<ArrowNumber value={minPilarStats.count}>
					{#snippet arrow()}
						<ArrowUp styleTw="size-6 text-[#0FC917]" strokeWidth={2} />
					{/snippet}
				</ArrowNumber>
			</div>
		</div>
	{/snippet}
</ViewCard>
<ViewCard contentClass="w-full">
	{#snippet content()}
		<div class="flex w-full items-center justify-between gap-3 p-6">
			<div class="flex flex-col gap-3">
				<p class="text-sm font-medium text-black">Pilares con más problemas</p>
				<div class="flex items-center gap-2">
					<div class="rounded-xl bg-alineados-green-50 p-2">
						<Hand styleTw="size-9 text-alineados-green-900" />
					</div>
					<div>
						<p class="text-xs font-medium text-alineados-gray-400">Pilar</p>
						<p class="-mt-1 text-2xl font-medium text-alineados-gray-800">{maxPilarStats.name}</p>
					</div>
				</div>
			</div>
			<div class="flex h-full items-end">
				<ArrowNumber value={maxPilarStats.count}>
					{#snippet arrow()}
						<ArrowDown styleTw="size-6 text-[#FB5B5B]" strokeWidth={2} />
					{/snippet}
				</ArrowNumber>
			</div>
		</div>
	{/snippet}
</ViewCard>
