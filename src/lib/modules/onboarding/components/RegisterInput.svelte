<script lang="ts">
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';

	// Props
	let {
		label,
		forId,
		type = 'text',
		placeholder,
		errorMessage = '*Campo requerido',
		value = $bindable()
	} = $props();

	// State
	let isInvalid = $state(false);

	// Functions
	function validateInput() {
		const regex = /^[A-Za-zÀ-ÿ\u00f1\u00d1]{2,10}$/;
		/*
		if (value.trim() === '') {
			isInvalid = true;
			errorMessage = '*Campo requerido';
		} 			
		else */ if (!regex.test(value)) {
			isInvalid = true;
			errorMessage = '*Solo se aceptan letras';
		} else {
			isInvalid = false;
			errorMessage = '';
		}
	}
</script>

<div class="flex w-1/2 flex-col gap-1">
	<div class="flex flex-col gap-2">
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
	</div>
	<span class:invisible={!isInvalid} class="text-xs text-[#C90404]">{errorMessage}</span>
</div>
