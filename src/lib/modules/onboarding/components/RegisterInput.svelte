<script lang="ts">
	import type {
		OnboardingValidation,
		RegisterValidation
	} from '$lib/interfaces/Onboarding.interface';
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';
	import { ValidationType } from '$lib/interfaces/Onboarding.interface';

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
	const textRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1]{1,20}$/;
	const usernameRegex = /^\S{1,20}$/;

	// Validation function
	function validateInput() {
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
					if (!textRegex.test(value)) {
						isInvalid = true;
						errorMessage = '*solo se aceptan letras';
					}
				} else {
					if (!usernameRegex.test(value)) {
						isInvalid = true;
						errorMessage = '*solo se aceptan letras y números';
					}
				}

				if (value.length > 20) {
					isInvalid = true;
					errorMessage = '*máximo 20 caracteres';
				} else {
					isInvalid = false;
					errorMessage = '';
				}
			}
		}
	}
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
	/>
	{#if isInvalid || validation.register[keyString] !== ValidationType.ALL_GOOD}
		<span class="absolute -bottom-3 left-1 text-xs text-[#C90404]" style="opacity: 1; height: 1em;">
			{#if validation.register[keyString] === ValidationType.REQUIRED}
				*campo requerido
			{:else if validation.register[keyString] === ValidationType.INVALID_NAME}
				*solo se aceptan letras
			{:else if validation.register[keyString] === ValidationType.IS_TOO_LONG}
				*máximo 20 caracteres
			{:else if validation.register[keyString] === ValidationType.INVALID_EMAIL}
				*correo electrónico inválido
			{:else}
				{errorMessage}
			{/if}
		</span>
	{/if}
</div>
