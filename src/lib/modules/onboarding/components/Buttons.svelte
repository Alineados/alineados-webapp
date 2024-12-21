<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type {
		OnboardingValidation,
		ValidationError,
		RegisterValidation,
		EmailValidation,
		PasswordValidation
	} from '$lib/interfaces/onbarding';
	import { ValidationType } from '$lib/interfaces/onbarding';
	import { ButtonAction } from '$lib/interfaces/onbarding';

	// Props
	let {
		action,
		validation = $bindable(),
		data = $bindable()
	}: {
		action: string;
		data: string;
		validation: OnboardingValidation;
	} = $props();

	// Handle to go to the previous step
	function handlePrevious(e: Event) {
		e.preventDefault();

		// Convert Map to array for easier indexing
		const steps = Array.from(ButtonAction.entries());
		// Find current step index
		const currentIndex = steps.findIndex(([_, value]) => value === action);
		// Get previous step number
		const previousStep = steps[currentIndex - 1][0];

		goto(`/onboarding/steps/${previousStep}`);
	}

	$inspect({ action });
</script>

<form
	method="POST"
	use:enhance={({}) => {
		return async ({ result }) => {
			// If there is an error in the form
			if (result.type === 'success' && result.data && result.data.type === 'error') {
				const fields = result.data.validations as ValidationError[];
				fields.forEach((error: ValidationError) => {
					const { field, errorType } = error as {
						field: keyof RegisterValidation | keyof EmailValidation | keyof PasswordValidation;
						errorType: ValidationType;
					};

					if (result.data?.button === 'register') {
						validation.register[field as keyof RegisterValidation] = errorType;
					} else if (result.data?.button === 'email') {
						validation.email[field as keyof EmailValidation] = errorType;
					} else {
						validation.password[field as keyof PasswordValidation] = errorType;
					}
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
		style="visibility: {action === 'register' ? 'hidden' : 'visible'};"
		onclick={handlePrevious}
	>
		<span class="mr-2">&larr;</span> Regresar
	</button>

	<button
		class="flex items-center rounded-2xl bg-[#0FC917] px-8 py-4 text-sm font-semibold text-[#F7F7F7] transition duration-300 ease-in-out hover:border hover:border-[#0FC917] hover:bg-[#F7F7F7] hover:text-[#0FC917]"
		formaction={`?/${action}`}
	>
		{#if action === 'finish'}
			Terminar
		{:else}
			Siguiente
		{/if}

		<span class="ml-2">&rarr;</span>
	</button>
</form>
