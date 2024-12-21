<script lang="ts">
	import type { OnboardingValidation, RegisterValidation } from '$lib/interfaces/onbarding';
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';
	import { RegisterValidationType } from '$lib/interfaces/onbarding';

	// Props
	let {
		label,
		inputKey,
		type = 'text',
		placeholder,
		value = $bindable(),
		validation = $bindable()
	}: {
		label: string;
		inputKey: string;
		type?: string;
		placeholder: string;
		value: string;
		validation: OnboardingValidation;
	} = $props();

	// States
	let isInvalid = $state(false);
	let errorMessage = $state('');

	// Derived
	let keyString = $derived(inputKey) as keyof RegisterValidation;

	// Regex
	const textRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1]{1,20}$/;

	// Validation function
	function validateInput() {
		// Reguired validation
		Object.keys(validation.register).forEach((key) => {
			if (key === inputKey) {
				validation.register[keyString].isWrong = false;
				validation.register[keyString].errorType = RegisterValidationType.ALL_GOOD;
			}
		});

		// Input validation
		if (value.length === 0) {
			isInvalid = false;
			errorMessage = '';
		} else {
			if (type !== 'email') {
				if (value.length > 20) {
					isInvalid = true;
					errorMessage = '*máximo 20 caracteres';
				} else if (!textRegex.test(value)) {
					isInvalid = true;
					errorMessage = '*solo se aceptan letras';
				} else {
					isInvalid = false;
					errorMessage = '';
				}
			}
		}
	}
</script>

<div class="relative flex w-1/2 flex-col gap-1">
	<Label class="text-lg font-semibold text-black" for={inputKey}>{label}</Label>

	<Input
		class="rounded-lg border-alineados-gray-100 bg-alineados-gray-50 text-base font-normal placeholder:text-alineados-gray-500"
		id={inputKey}
		{type}
		{placeholder}
		autocapitalize="none"
		autocorrect="off"
		bind:value
		oninput={validateInput}
	/>
	{#if isInvalid || validation.register[keyString].isWrong}
		<span class="absolute -bottom-3 left-1 text-xs text-[#C90404]" style="opacity: 1; height: 1em;">
			{#if validation.register[keyString].errorType === RegisterValidationType.REQUIRED && validation.register[keyString].isWrong}
				*campo requerido
			{:else if validation.register[keyString].errorType === RegisterValidationType.INVALID_NAME && validation.register[keyString].isWrong}
				*solo se aceptan letras
			{:else if validation.register[keyString].errorType === RegisterValidationType.IS_TOO_LONG && validation.register[keyString].isWrong}
				*máximo 20 caracteres
			{:else if validation.register[keyString].errorType === RegisterValidationType.INVALID_EMAIL && validation.register[keyString].isWrong}
				*correo electrónico inválido
			{:else}
				{errorMessage}
			{/if}
		</span>
	{/if}
</div>
