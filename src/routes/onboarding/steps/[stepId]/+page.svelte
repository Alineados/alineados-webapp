<script lang="ts">
	import { page } from '$app/stores';

	import Buttons from '$lib/modules/onboarding/components/Buttons.svelte';
	import RegisterForm from '$lib/modules/onboarding/RegisterForm.svelte';
	import EmailVerification from '$lib/modules/onboarding/EmailVerification.svelte';
	import PasswordCreation from '$lib/modules/onboarding/PasswordCreation.svelte';
	import Welcome from '$lib/modules/onboarding/Welcome.svelte';
	import type { OnboardingData, OnboardingValidation } from '$lib/interfaces/onbarding';
	import { ButtonAction, ValidationType } from '$lib/interfaces/onbarding';
	import { onMount } from 'svelte';

	// Initial state
	let onboardingData = $state<OnboardingData>();
	let validation = $state<OnboardingValidation>();

	onMount(() => {
		validation = {
			register: {
				firstName: ValidationType.ALL_GOOD,
				lastName: ValidationType.ALL_GOOD,
				email: ValidationType.ALL_GOOD,
				countryOfResidence: ValidationType.ALL_GOOD,
				countryOfBirth: ValidationType.ALL_GOOD,
				birthday: ValidationType.ALL_GOOD,
				phoneNumber: ValidationType.ALL_GOOD,
				whatsappNumber: ValidationType.ALL_GOOD,
				username: ValidationType.ALL_GOOD
			},
			email: {
				code: ValidationType.ALL_GOOD
			},
			password: {
				password: ValidationType.ALL_GOOD,
				confirmPassword: ValidationType.ALL_GOOD
			}
		};
		onboardingData = {
			register: {
				contactNotRequired: false,

				firstName: '',
				lastName: '',
				email: '',
				countryOfResidence: '',
				countryOfBirth: '',
				birthday: '',
				phoneNumber: {
					code: '',
					number: ''
				},
				whatsappNumber: {
					code: '',
					number: ''
				},
				username: 'valvk'
			},
			email: {
				code: ''
			},
			password: {
				password: '',
				confirmPassword: ''
			}
		};
	});

	// Derived stores for the current step
	const stepId = $derived($page.params.stepId);

	// JSON representation of the onboarding data
	let onboardingDataSJSON = $state('');

	$effect(() => {
		onboardingDataSJSON = JSON.stringify(onboardingData);
	});

	$inspect(validation);
</script>

<div class="h-4/5">
	{#if onboardingData && validation}
		{#if stepId === '1'}
			<RegisterForm bind:validation bind:register={onboardingData.register} />
		{:else if stepId === '2'}
			<EmailVerification bind:validation bind:emailVerification={onboardingData.email} />
		{:else if stepId === '3'}
			<PasswordCreation bind:validation bind:passwordCreation={onboardingData.password} />
		{:else if stepId === '4'}
			<Welcome />
		{/if}
		<Buttons
			action={ButtonAction.get(stepId) ?? '1'}
			bind:data={onboardingDataSJSON}
			bind:validation
		/>
	{/if}
</div>
