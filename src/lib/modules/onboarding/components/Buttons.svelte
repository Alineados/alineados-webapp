<script lang="ts">
	let {
		isFirst,
		isLast,
		nextStep,
		previousStep
	}: {
		isFirst: boolean;
		isLast: boolean;
		nextStep: string;
		previousStep: string | null | undefined;
	} = $props();
</script>

<div class="mt-3 flex justify-between">
	<a
		class="flex items-center rounded-2xl border border-alineados-gray-600 px-8 py-4 text-sm font-semibold text-alineados-gray-600 transition duration-300 ease-in-out hover:border hover:border-[#F7F7F7] hover:bg-alineados-gray-600 hover:text-[#F7F7F7]"
		href={previousStep}
		style="visibility: {isFirst ? 'hidden' : 'visible'};"
	>
		<span class="mr-2">&larr;</span> Regresar
	</a>
	<a
		class="flex items-center rounded-2xl bg-[#0FC917] px-8 py-4 text-sm font-semibold text-[#F7F7F7] transition duration-300 ease-in-out hover:border hover:border-[#0FC917] hover:bg-[#F7F7F7] hover:text-[#0FC917]"
		href={isLast ? '/auth/login' : nextStep}
	>
		{#if isLast}
			Terminar <span class="ml-2">&rarr;</span>
		{:else}
			Siguiente <span class="ml-2">&rarr;</span>
		{/if}
	</a>
</div>
