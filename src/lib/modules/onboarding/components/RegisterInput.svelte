<script lang="ts">
	import type {
		OnboardingValidation,
		RegisterValidation
	} from '$lib/interfaces/Onboarding.interface';
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';
	import { ValidationType } from '$lib/interfaces/Validations.interface';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import { getValidationMessage } from '$lib/utils/validationsMessage';

	// Props
	let {
		label,
		inputKey,
		type = 'text',
		placeholder,
		value = $bindable(),
		validation = $bindable(),
		contactNotRequired = false
	}: {
		label: string;
		inputKey: string;
		type?: string;
		placeholder: string;
		value: string;
		validation: OnboardingValidation;
		contactNotRequired: boolean;
	} = $props();

	// States
	let isInvalid = $state(false);
	let errorMessage = $state('');

	// Derived
	let keyString = $derived(inputKey) as keyof RegisterValidation;

	// Regex
	const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]{1,20}$/;
	const usernameRegex = /^\S{1,20}$/;

	// Add composition handling
	let isComposing = false;

	function handleComposition(event: CompositionEvent) {
		isComposing = event.type === 'compositionstart';
	}

	// Validation function
	function validateInput() {
		// Reset validation
		isInvalid = false;

		// Skip validation if composing
		if (isComposing) return;

		// Reguired validation
		Object.keys(validation.register).forEach((key) => {
			if (key === inputKey) {
				validation.register[keyString] = ValidationType.ALL_GOOD;
			}
		});

		// Input validation
		if (value.length === 0) {
			isInvalid = false;
			errorMessage = '';
		} else {
			if (type !== 'email') {
				if (keyString !== 'username') {
					if (!nameRegex.test(value)) {
						isInvalid = true;
						errorMessage = 'solo se aceptan letras';
					}
				} else {
					if (!usernameRegex.test(value)) {
						isInvalid = true;
						errorMessage = 'solo se aceptan letras o números';
					}
				}

				if (value.length > 20) {
					isInvalid = true;
					errorMessage = 'máximo 20 carácteres';
				}
			}
		}
	}

	// Add effect for contactNotRequired
	$effect(() => {
		if (contactNotRequired && type === 'email') {
			value = '';
			isInvalid = false;
			errorMessage = '';
			validation.register[keyString] = ValidationType.ALL_GOOD;
		}
	});
</script>

<div class="relative flex w-1/2 flex-col gap-1">
	<Label
		class={`text-lg font-semibold ${contactNotRequired && type === 'email' ? 'text-alineados-gray-300' : 'text-black'}`}
		for={inputKey}>{label}</Label
	>

	<Input
		class="rounded-lg border-alineados-gray-100 bg-alineados-gray-50 text-base font-normal placeholder:text-alineados-gray-500"
		id={inputKey}
		{type}
		{placeholder}
		autocapitalize="none"
		autocorrect="off"
		bind:value
		oninput={validateInput}
		disabled={contactNotRequired && type === 'email'}
		oncompositionstart={handleComposition}
		oncompositionend={handleComposition}
	/>

	{#if validation.register[keyString] !== ValidationType.ALL_GOOD}
		<ErrorMessage isError>
			{#snippet erroMessage()}
				{getValidationMessage(validation.register[keyString])}
			{/snippet}
		</ErrorMessage>
	{:else if isInvalid}
		<ErrorMessage
			>{#snippet erroMessage()}
				{errorMessage}
			{/snippet}</ErrorMessage
		>
	{/if}
</div>
