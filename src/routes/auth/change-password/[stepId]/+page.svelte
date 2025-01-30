<script lang="ts">
	import { page } from '$app/stores';
	import type {
		RecoverPasswordData,
		RecoverPasswordValidation
	} from '$lib/interfaces/Auth.interface';
	import { ValidationType } from '$lib/interfaces/Validations.interface';
	import ChangePasswordCode from '$lib/modules/auth/ChangePasswordCode.svelte';
	import ChangePasswordEmail from '$lib/modules/auth/ChangePasswordEmail.svelte';
	import ChangePasswordRestore from '$lib/modules/auth/ChangePasswordRestore.svelte';
	import Header from '$lib/modules/auth/components/Header.svelte';
	import { onMount } from 'svelte';

	// Initial state
	let recoverPasswordData = $state<RecoverPasswordData>();
	let recoverPasswordValidation = $state<RecoverPasswordValidation>();

	onMount(() => {
		recoverPasswordData = {
			email: '',
			password: '',
			confirmPassword: '',
			code: ''
		};
		recoverPasswordValidation = {
			email: ValidationType.ALL_GOOD,
			password: ValidationType.ALL_GOOD,
			confirmPassword: ValidationType.ALL_GOOD,
			code: ValidationType.ALL_GOOD
		};
	});

	// JSON representation of the login data
	let recoverPasswordDataJSON = $state('');

	$effect(() => {
		recoverPasswordDataJSON = JSON.stringify(recoverPasswordData);
	});

	// Derived stores for the current step
	const stepId = $derived($page.params.stepId);

</script>

<div class="h-4/5">
	{#if recoverPasswordData && recoverPasswordValidation}
		{#if stepId === '1'}
			<ChangePasswordEmail
				bind:data={recoverPasswordData}
				bind:dataJSON={recoverPasswordDataJSON}
				bind:validation={recoverPasswordValidation}
			/>
		{:else if stepId === '2'}
			<ChangePasswordCode
				bind:data={recoverPasswordData}
				bind:dataJSON={recoverPasswordDataJSON}
				bind:validation={recoverPasswordValidation}
			/>
		{:else if stepId === '3'}
			<ChangePasswordRestore
				bind:data={recoverPasswordData}
				bind:dataJSON={recoverPasswordDataJSON}
				bind:validation={recoverPasswordValidation}
			/>
		{/if}
	{/if}
</div>
