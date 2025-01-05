<script lang="ts">
	import type { OnboardingValidation, EmailValidation } from '$lib/interfaces/Onboarding.interface';
	import { ValidationType } from '$lib/interfaces/Onboarding.interface';
	import * as InputOTP from '$lib/shared/ui/input-otp/index';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';

	// Props
	let {
		value = $bindable(),
		validation = $bindable()
	}: {
		value: string;
		validation: OnboardingValidation;
	} = $props();

	// Change effect
	$effect(() => {
		if (value) {
			validation.email[keyString] = ValidationType.ALL_GOOD;
		}
	});

	// States
	let inputKey = $state('code');

	// Derived
	let keyString = $derived(inputKey) as keyof EmailValidation;

	// Required
	let maxlength: number = 6;
	let pattern: string = new RegExp(REGEXP_ONLY_DIGITS).source;

	$inspect({ value });
</script>

<div class="relative mt-12">
	<InputOTP.Root {maxlength} {pattern} bind:value>
		{#snippet children({ cells })}
			<InputOTP.Group>
				{#each cells as cell}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>

	{#if validation.email[keyString] !== ValidationType.ALL_GOOD}
		<span class="absolute -bottom-3 left-1 text-xs text-[#C90404]" style="opacity: 1; height: 1em;">
			{#if validation.email[keyString] === ValidationType.REQUIRED}
				*campo requerido
			{:else if validation.email[keyString] === ValidationType.IS_TOO_SHORT}
				*código incompleto
			{:else if validation.email[keyString] === ValidationType.INVALID_CODE}
				*código inválido
			{/if}
		</span>
	{/if}
</div>
