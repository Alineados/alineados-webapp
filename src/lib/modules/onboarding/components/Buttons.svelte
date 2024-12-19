<script lang="ts">
	import { enhance } from '$app/forms';

	let {
		isFirst,
		isLast,
		action,
		nextStep,
		previousStep,
		data = $bindable(),
		onNext = () => {},
		onPrevious = () => {}
	}: {
		isFirst: boolean;
		isLast: boolean;
		action: string;
		nextStep: string;
		previousStep: string | null | undefined;
		data: string;
		onNext?: () => void;
		onPrevious?: () => void;
	} = $props();
</script>

<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		//

		return async ({ result, update }) => {
			console.log(result);

			if (result.type === 'error') {
				// $validation
				console.log('AQUI');
			}

			if (result.type === 'success' && result?.data?.type === 'register') {
				onNext();
			}

			if (result.type === 'success' && result?.data?.type === 'finsh') {
				onNext();
			}
			// TODO: Handle other cases
		};
	}}
	class="mt-3 flex justify-between"
>
	<input name="data" type="text" class="hidden" bind:value={data} />
	<button
		class="flex items-center rounded-2xl border border-alineados-gray-600 px-8 py-4 text-sm font-semibold text-alineados-gray-600 transition duration-300 ease-in-out hover:border hover:border-[#F7F7F7] hover:bg-alineados-gray-600 hover:text-[#F7F7F7]"
		onclick={onPrevious}
		style="visibility: {isFirst ? 'hidden' : 'visible'};"
	>
		<span class="mr-2">&larr;</span> Regresar
	</button>

	{#if isLast}
		<button
			class="flex items-center rounded-2xl bg-[#0FC917] px-8 py-4 text-sm font-semibold text-[#F7F7F7] transition duration-300 ease-in-out hover:border hover:border-[#0FC917] hover:bg-[#F7F7F7] hover:text-[#0FC917]"
			onclick={onNext}
			formaction="?/finish"
		>
			Terminar <span class="ml-2">&rarr;</span>
		</button>
	{:else}
		<button
			class="flex items-center rounded-2xl bg-[#0FC917] px-8 py-4 text-sm font-semibold text-[#F7F7F7] transition duration-300 ease-in-out hover:border hover:border-[#0FC917] hover:bg-[#F7F7F7] hover:text-[#0FC917]"
			onclick={onNext}
			formaction={`?/${action}`}
		>
			Siguiente <span class="ml-2">&rarr;</span>
		</button>
	{/if}
</form>
