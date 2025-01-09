<script lang="ts">
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import type { OnboardingValidation, EmailValidation } from '$lib/interfaces/Onboarding.interface';
	import { ValidationType } from '$lib/interfaces/Validations.interface';
	import * as InputOTP from '$lib/shared/ui/input-otp/index';
	import { getValidationMessage } from '$lib/utils/validationsMessage';
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
		<ErrorMessage isError>
			{#snippet erroMessage()}
				{getValidationMessage(validation.email[keyString])}
			{/snippet}
		</ErrorMessage>
	{/if}
</div>
