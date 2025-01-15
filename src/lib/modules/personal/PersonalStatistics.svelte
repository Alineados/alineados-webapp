<script lang="ts">
	import ViewCard from '$lib/components/ViewCard.svelte';
	import Head from '$lib/icons/Head.svelte';

	let {
		type
	}: {
		type: 'thoughts' | 'stories';
	} = $props();
	// Calcule the total of problems
	let totalFirst = 342;
	let totalSecond = 342;
</script>

<ViewCard contentClass="w-full">
	{#snippet content()}
		<div class="flex w-full items-center gap-3 p-4">
			<div class="rounded-xl bg-alineados-green-50 p-2">
				<Head styleTw="size-7 text-alineados-green-900" />
			</div>
			<div>
				<p class="text-sm font-medium text-black">
					{#if type === 'thoughts'}
						Total de Pensamientos
					{:else if type === 'stories'}
						Total De Testimonios
					{/if}
				</p>
				<p class="-mt-1 text-xl font-semibold text-alineados-gray-800">{totalFirst}</p>
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
				<p class="text-sm font-medium text-black">
					{#if type === 'thoughts'}
						Total de Destacados
					{:else if type === 'stories'}
						Total de conversaciones
					{/if}
				</p>
				<p class="-mt-1 text-xl font-semibold text-alineados-gray-800">{totalSecond}</p>
			</div>
		</div>
	{/snippet}
</ViewCard>
