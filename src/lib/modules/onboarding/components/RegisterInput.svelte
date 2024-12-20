<script lang="ts">
	import type { OnboardingValidation, RegisterValidation } from '$lib/interfaces/onbarding';
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';

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
	const textRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1]{2,20}$/;
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// Validation function
	function validateInput() {
		// Reguired validation
		Object.keys(validation.register).forEach((key) => {
			if (key === inputKey) {
				validation.register[keyString] = false;
			}
		});

		// Input validation
		if (type === 'email') {
			if (!emailRegex.test(value)) {
				isInvalid = true;
				errorMessage = '*correo electrónico inválido';
			} else {
				isInvalid = false;
				errorMessage = '';
			}
		} else {
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
	{#if isInvalid || validation.register[keyString]}
		<span class="absolute -bottom-3 left-1 text-xs text-[#C90404]" style="opacity: 1; height: 1em;">
			{#if validation.register[keyString]}
				*campo requerido
			{:else}
				{errorMessage}
			{/if}
		</span>
	{/if}
</div>
