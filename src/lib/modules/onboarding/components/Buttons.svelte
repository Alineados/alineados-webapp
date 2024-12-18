<script lang="ts">
	let {
		isFirst,
		isLast,
		nextStep,
		previousStep,
		onNext = () => {},
		onPrevious = () => {}
	}: {
		isFirst: boolean;
		isLast: boolean;
		nextStep: string;
		previousStep: string | null | undefined;
		onNext?: () => void;
		onPrevious?: () => void;
	} = $props();
</script>

<div class="mt-3 flex justify-between">
	<button
		class="flex items-center rounded-2xl border border-alineados-gray-600 px-8 py-4 text-sm font-semibold text-alineados-gray-600 transition duration-300 ease-in-out hover:border hover:border-[#F7F7F7] hover:bg-alineados-gray-600 hover:text-[#F7F7F7]"
		onclick={onPrevious}
		style="visibility: {isFirst ? 'hidden' : 'visible'};"
	>
		<span class="mr-2">&larr;</span> Regresar
	</button>
	<button
		class="flex items-center rounded-2xl bg-[#0FC917] px-8 py-4 text-sm font-semibold text-[#F7F7F7] transition duration-300 ease-in-out hover:border hover:border-[#0FC917] hover:bg-[#F7F7F7] hover:text-[#0FC917]"
		onclick={onNext}
	>
		{#if isLast}
			Terminar <span class="ml-2">&rarr;</span>
		{:else}
			Siguiente <span class="ml-2">&rarr;</span>
		{/if}
	</button>
</div>
