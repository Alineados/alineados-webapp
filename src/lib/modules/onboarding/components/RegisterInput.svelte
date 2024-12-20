<script lang="ts">
	import type { OnboardingValidation, RegisterValidation } from '$lib/interfaces/onbarding';
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';

	// Props
	let {
		label,
		forId,
		type = 'text',
		placeholder,
		value = $bindable(),
		validation = $bindable(),
		isInvalid = false,
		errorMessage = ''
	}: {
		label: string;
		forId: string;
		type?: string;
		placeholder: string;
		value: string;
		validation: OnboardingValidation;
		isInvalid: boolean;
		errorMessage: string;
	} = $props();

	let keyString = $derived(forId) as keyof RegisterValidation;
	// Functions
	function validateInput() {
		console.log('validateInput', { forId, value: validation.register });
		Object.keys(validation.register).forEach((key) => {
			if (key === forId) {
				validation.register[keyString] = false;
			}
		});

		const regex = /^[A-Za-zÀ-ÿ\u00f1\u00d1]{2,10}$/;

		if (value.trim() === '') {
			isInvalid = true;
			//errorMessage = '*Campo requerido';
		} else if (value.length > 10) {
			isInvalid = true;
			errorMessage = '*Máximo 10 caracteres';
		} else if (!regex.test(value)) {
			isInvalid = true;
			errorMessage = '*Solo se aceptan letras';
		} else {
			isInvalid = false;
			errorMessage = '';
		}
	}
</script>

<div class="flex w-1/2 flex-col gap-0">
	<div class="relative flex flex-col gap-2">
		<Label class="text-lg font-semibold text-black" for={forId}>{label}</Label>
		<Input
			class="rounded-lg border-alineados-gray-100 bg-alineados-gray-50 text-base font-normal placeholder:text-alineados-gray-500"
			id={forId}
			{type}
			{placeholder}
			autocapitalize="none"
			autocorrect="off"
			bind:value
			oninput={validateInput}
		/>
		{#if validation.register[keyString]}
			<span
				class="absolute -bottom-3 left-3 text-xs text-[#C90404]"
				style="opacity: 1; height: 1em;"
			>
				error message
			</span>
		{/if}
	</div>

	<span class="text-xs text-[#C90404]" style="opacity: {isInvalid ? 1 : 0}; height: 1em;">
		{errorMessage}
	</span>
</div>
