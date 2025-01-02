<script lang="ts">
	import ArrowNumber from '$lib/components/ArrowNumber.svelte';
	import ViewCard from '$lib/components/ViewCard.svelte';
	import ArrowDown from '$lib/icons/ArrowDown.svelte';
	import ArrowUp from '$lib/icons/ArrowUp.svelte';
	import Hand from '$lib/icons/Hand.svelte';
	import Head from '$lib/icons/Head.svelte';

	// Calcule the total of problems
	let totalStories = 342;
	let totalThoughts = 342;
</script>

<ViewCard contentClass="w-full">
	{#snippet content()}
		<div class="flex w-full items-center gap-3 p-4">
			<div class="rounded-xl bg-alineados-green-50 p-2">
				<Head styleTw="size-7 text-alineados-green-900" />
			</div>
			<div>
				<p class="text-sm font-medium text-black">Total De Testimonios</p>
				<p class="-mt-1 text-xl font-semibold text-alineados-gray-800">{totalStories}</p>
			</div>
		</div>
	{/snippet}
</ViewCard>
<ViewCard contentClass="w-full">
	{#snippet content()}
		<div class="flex w-full items-center gap-3 p-4">
			<div class="rounded-xl bg-alineados-green-50 p-2">
				<Head styleTw="size-7 text-alineados-green-900" />
			</div>
			<div>
				<p class="text-sm font-medium text-black">Total De Conversaciones</p>
				<p class="-mt-1 text-xl font-semibold text-alineados-gray-800">{totalThoughts}</p>
			</div>
		</div>
	{/snippet}
</ViewCard>
