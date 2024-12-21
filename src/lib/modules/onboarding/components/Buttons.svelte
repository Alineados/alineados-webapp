<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type {
		OnboardingValidation,
		RegisterValidation,
		ValidationError
	} from '$lib/interfaces/onbarding';

	let {
		isFirst,
		isLast,
		action,
		validation = $bindable(),
		data = $bindable()
	}: {
		isFirst: boolean;
		isLast: boolean;
		action: string;
		data: string;
		validation: OnboardingValidation;
	} = $props();
</script>

<form
	method="POST"
	use:enhance={({}) => {
		return async ({ result, update }) => {
			// If there is an error
			if (result.type === 'success' && result.data && result.data.type === 'error') {
				const fields = result.data.validations as ValidationError[];
				fields.forEach((error: ValidationError) => {
					const { field, errorType } = error;
					validation.register[field] = {
						isWrong: true,
						errorType: errorType
					};
				});
			}

			// If there is a redirect
			if (result.type === 'redirect') {
				goto(result.location);
			}
		};
	}}
	class="mt-3 flex justify-between"
>
	<input name="data" type="text" class="hidden" bind:value={data} />
	<button
		class="flex items-center rounded-2xl border border-alineados-gray-600 px-8 py-4 text-sm font-semibold text-alineados-gray-600 transition duration-300 ease-in-out hover:border hover:border-[#F7F7F7] hover:bg-alineados-gray-600 hover:text-[#F7F7F7]"
		style="visibility: {isFirst ? 'hidden' : 'visible'};"
	>
		<span class="mr-2">&larr;</span> Regresar
	</button>

	{#if isLast}
		<button
			class="flex items-center rounded-2xl bg-[#0FC917] px-8 py-4 text-sm font-semibold text-[#F7F7F7] transition duration-300 ease-in-out hover:border hover:border-[#0FC917] hover:bg-[#F7F7F7] hover:text-[#0FC917]"
			formaction="?/finish"
		>
			Terminar <span class="ml-2">&rarr;</span>
		</button>
	{:else}
		<button
			class="flex items-center rounded-2xl bg-[#0FC917] px-8 py-4 text-sm font-semibold text-[#F7F7F7] transition duration-300 ease-in-out hover:border hover:border-[#0FC917] hover:bg-[#F7F7F7] hover:text-[#0FC917]"
			formaction={`?/${action}`}
		>
			Siguiente <span class="ml-2">&rarr;</span>
		</button>
	{/if}
</form>
