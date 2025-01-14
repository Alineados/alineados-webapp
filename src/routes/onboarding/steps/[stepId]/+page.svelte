<script lang="ts">
	import { page } from '$app/stores';

	import Buttons from '$lib/modules/onboarding/components/Buttons.svelte';
	import RegisterForm from '$lib/modules/onboarding/RegisterForm.svelte';
	import EmailVerification from '$lib/modules/onboarding/EmailVerification.svelte';
	import PasswordCreation from '$lib/modules/onboarding/PasswordCreation.svelte';
	import Welcome from '$lib/modules/onboarding/Welcome.svelte';
	import type { OnboardingData, OnboardingValidation } from '$lib/interfaces/Onboarding.interface';
	import { ButtonAction } from '$lib/interfaces/Onboarding.interface';
	import { onMount } from 'svelte';
	import { ValidationType } from '$lib/interfaces/Validations.interface';

	// Initial state
	let onboardingData = $state<OnboardingData>();
	let validation = $state<OnboardingValidation>();
	let isChecked = $state(false); // fot whatsapp checkbox

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
				password: [],
				confirmPassword: []
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
				birthday: {
					day: '',
					month: '',
					year: ''
				},
				phoneNumber: {
					code: '',
					number: ''
				},
				whatsappNumber: {
					code: '',
					number: ''
				},
				username: ''
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
			<RegisterForm bind:validation bind:register={onboardingData.register} bind:isChecked />
		{:else if stepId === '2'}
			<EmailVerification
				bind:validation
				bind:emailVerification={onboardingData.email}
				bind:registerData={onboardingData.register}
				bind:data={onboardingDataSJSON}
			/>
		{:else if stepId === '3'}
			<PasswordCreation
				bind:validation
				bind:passwordCreation={onboardingData.password}
				bind:registerData={onboardingData.register}
			/>
		{:else if stepId === '4'}
			<Welcome bind:registerData={onboardingData.register} />
		{/if}
		<Buttons
			action={ButtonAction.get(stepId) ?? '1'}
			bind:data={onboardingDataSJSON}
			bind:validation
		/>
	{/if}
</div>
