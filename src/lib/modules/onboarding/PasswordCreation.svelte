<script lang="ts">
	import type { OnboardingValidation, Password } from '$lib/interfaces/onbarding';
	import Header from '$lib/modules/onboarding/components/Header.svelte';
	import PasswordInput from '$lib/modules/onboarding/components/PasswordInput.svelte';
	import PasswordRequirement from '$lib/modules/onboarding/components/PasswordRequirement.svelte';
	import PasswordStrengthening from './components/PasswordStrengthening.svelte';
	import { ValidationType } from '$lib/interfaces/onbarding';

	// Props
	let {
		passwordCreation = $bindable(),
		validation = $bindable()
	}: { passwordCreation: Password; validation: OnboardingValidation } = $props();

	// Mock data
	let userFirstName = 'José';
	let userLastName = 'Penagos';
	let userEmail = 'jose.penados@gmail.com';

	// Rules
	let strengthening = $state(0);
	let requirements = $state({
		noNameOrEmail: false,
		minLength: false,
		hasNumberOrSymbol: false
	});

	// Control visibility of confirm password input
	let showConfirmPassword = $state(false);

	// Normalize string
	function normalizeString(str: string): string {
		return str
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
	}

	// Password evaluation
	function evaluatePassword() {
		validation.password.password = ValidationType.ALL_GOOD;

		// Reset requirements and strengthening
		if (passwordCreation.password.trim() === '') {
			requirements.noNameOrEmail = false;
			requirements.minLength = false;
			requirements.hasNumberOrSymbol = false;
			strengthening = 0;
			return;
		}

		// Normalize password and user data
		const normalizedPassword = normalizeString(passwordCreation.password);
		requirements.noNameOrEmail =
			!normalizedPassword.includes(normalizeString(userFirstName)) &&
			!normalizedPassword.includes(normalizeString(userLastName)) &&
			!normalizedPassword.includes(normalizeString(userEmail));
		requirements.minLength = passwordCreation.password.length >= 8;
		requirements.hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(passwordCreation.password);

		// Evaluate strengthening
		strengthening = Object.values(requirements).filter(Boolean).length;

		// Show confirm password input if password is strong
		if (strengthening === 3) {
			showConfirmPassword = true;
		} else {
			showConfirmPassword = false;
		}
	}

	// Confirm password evaluation
	let matchPasswords = $state(false);

	// Evaluate confirm password
	function evaluateConfirmPassword() {
		validation.password.confirmPassword = ValidationType.ALL_GOOD;

		if (passwordCreation.confirmPassword.trim() === '') return;

		if (passwordCreation.confirmPassword === passwordCreation.password) {
			matchPasswords = true;
		} else {
			matchPasswords = false;
		}
	}
</script>

<div class="flex h-full w-full flex-col items-start justify-center">
	<Header title="Creación de Contraseña" />
	<div class="mt-9 flex w-full flex-col gap-5">
		<PasswordInput
			label="Contraseña"
			id="password"
			placeholder="Ingrese su contraseña"
			bind:value={passwordCreation.password}
			oninput={evaluatePassword}
		/>
		<ul class="space-y-1">
			<li>
				<PasswordStrengthening {strengthening} />
			</li>
			<li>
				<PasswordRequirement
					checked={requirements.noNameOrEmail}
					text="No puede contener tu nombre o dirección de correo electrónicos"
				/>
			</li>
			<li>
				<PasswordRequirement checked={requirements.minLength} text="Mínimo 8 caracteres" />
			</li>
			<li>
				<PasswordRequirement
					checked={requirements.hasNumberOrSymbol}
					text="Contiene un número o símbolo"
				/>
			</li>
		</ul>

		{#if validation.password.password !== ValidationType.ALL_GOOD}
			<span class=" -bottom-3 left-1 text-xs text-[#C90404]" style="opacity: 1; height: 1em;">
				{#if validation.password.confirmPassword === ValidationType.REQUIRED}
					*campo requerido
				{/if}
			</span>
		{/if}
	</div>

	<div
		class="mt-11 flex w-full flex-col gap-4"
		class:invisible={!showConfirmPassword || passwordCreation.password.length === 0}
	>
		<PasswordInput
			label="Confirmar Contraseña"
			id="confirm-password"
			placeholder="Confirme su contraseña"
			bind:value={passwordCreation.confirmPassword}
			oninput={evaluateConfirmPassword}
		/>
		<ul class="space-y-1">
			<li>
				<PasswordRequirement checked={matchPasswords} text="Match de contraseñas" />
			</li>
		</ul>

		{#if validation.password.confirmPassword !== ValidationType.ALL_GOOD}
			<span class="-bottom-3 left-1 text-xs text-[#C90404]" style="opacity: 1; height: 1em;">
				{#if validation.password.confirmPassword === ValidationType.REQUIRED}
					*campo requerido
				{:else if validation.password.confirmPassword === ValidationType.PASSWORDS_DONT_MATCH}
					*las contraseñas no coinciden
				{/if}
			</span>
		{/if}
	</div>
</div>
