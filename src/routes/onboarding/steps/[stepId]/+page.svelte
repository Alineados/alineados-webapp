<script lang="ts">
	import { page } from '$app/stores';

	import Buttons from '$lib/modules/onboarding/components/Buttons.svelte';
	import RegisterForm from '$lib/modules/onboarding/RegisterForm.svelte';
	import EmailVerification from '$lib/modules/onboarding/EmailVerification.svelte';
	import PasswordCreation from '$lib/modules/onboarding/PasswordCreation.svelte';
	import Welcome from '$lib/modules/onboarding/Welcome.svelte';
	import type { OnboardingData, OnboardingValidation } from '$lib/interfaces/onbarding';
	import { RegisterValidationType } from '$lib/interfaces/onbarding';
	import { onMount } from 'svelte';

	let onboardingData = $state<OnboardingData>();
	let validation = $state<OnboardingValidation>();

	onMount(() => {
		validation = {
			register: {
				firstName: {
					isWrong: false,
					errorType: RegisterValidationType.ALL_GOOD
				},
				lastName: {
					isWrong: false,
					errorType: RegisterValidationType.ALL_GOOD
				},
				email: {
					isWrong: false,
					errorType: RegisterValidationType.ALL_GOOD
				},
				countryOfResidence: {
					isWrong: false,
					errorType: RegisterValidationType.ALL_GOOD
				},
				countryOfBirth: {
					isWrong: false,
					errorType: RegisterValidationType.ALL_GOOD
				},
				birthday: {
					isWrong: false,
					errorType: RegisterValidationType.ALL_GOOD
				},
				phoneNumber: {
					isWrong: false,
					errorType: RegisterValidationType.ALL_GOOD
				},
				whatsappNumber: {
					isWrong: false,
					errorType: RegisterValidationType.ALL_GOOD
				}
			}
		};
		onboardingData = {
			register: {
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
				}
			}
		};
	});

	const stepId = $derived($page.params.stepId);
	const isFirst = $derived(stepId === '1');
	const isLast = $derived(stepId === '4');

	let onboardingDataSJSON = $state('');

	$effect(() => {
		onboardingDataSJSON = JSON.stringify(onboardingData);
	});

	const buttonAction = new Map([
		['1', 'register'],
		['2', 'email'],
		['3', 'password'],
		['4', 'finish']
	]);

	$inspect(validation);
</script>

<div class="h-4/5">
	{#if onboardingData && validation}
		{#if stepId === '1'}
			<RegisterForm bind:validation bind:register={onboardingData.register} />
		{:else if stepId === '2'}
			<EmailVerification />
		{:else if stepId === '3'}
			<PasswordCreation />
		{:else if stepId === '4'}
			<Welcome />
		{/if}
		<Buttons
			action={buttonAction.get(stepId) ?? '1'}
			bind:data={onboardingDataSJSON}
			bind:validation
			{isFirst}
			{isLast}
		/>
	{/if}
</div>
