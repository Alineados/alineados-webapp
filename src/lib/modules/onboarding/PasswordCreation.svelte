<script lang="ts">
	import type {
		OnboardingValidation,
		Password,
		Register
	} from '$lib/interfaces/Onboarding.interface';
	import PasswordInput from '$lib/modules/onboarding/components/PasswordInput.svelte';
	import PasswordRequirement from '$lib/modules/onboarding/components/PasswordRequirement.svelte';
	import PasswordStrengthening from './components/PasswordStrengthening.svelte';
	import { ValidationType } from '$lib/interfaces/Validations.interface';

	// Props
	let {
		passwordCreation = $bindable(),
		registerData = $bindable(),
		validation = $bindable()
	}: {
		passwordCreation: Password;
		registerData: Register;
		validation: OnboardingValidation;
	} = $props();

	// Rules
	let strengthening = $state(0);
	let requirements = $state({
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

	// Password evaluation in real time
	function evaluatePassword() {
		validation.password.password = [];
		validation.password.confirmPassword = [];

		// Reset requirements and strengthening
		if (passwordCreation.password.trim() === '') {
			requirements.minLength = false;
			requirements.hasNumberOrSymbol = false;
			strengthening = 0;
			return;
		}

		requirements.minLength = passwordCreation.password.length >= 8;
		requirements.hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(passwordCreation.password);

		// Evaluate strengthening
		strengthening = Object.values(requirements).filter(Boolean).length;

		// Show confirm password input if password is strong
		if (strengthening === 2) {
			showConfirmPassword = true;
		} else {
			showConfirmPassword = false;
		}
	}

	// Confirm password evaluation
	let matchPasswords = $state(false);

	// Evaluate confirm password
	function evaluateConfirmPassword() {
		validation.password.confirmPassword = [];

		if (passwordCreation.confirmPassword.trim() === '') return;

		if (passwordCreation.confirmPassword === passwordCreation.password) {
			matchPasswords = true;
		} else {
			matchPasswords = false;
		}
	}
</script>

<div class="flex h-full w-full flex-col items-start justify-center">
	<div class="flex w-full border-b border-alineados-gray-200 pb-2">
		<h2 class="text-3xl font-semibold text-alineados-gray-900">Datos Personales</h2>
	</div>
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
				<PasswordStrengthening {strengthening} validation={validation.password.password} />
			</li>
			<li>
				<PasswordRequirement
					checked={requirements.minLength}
					message="Mínimo 8 caracteres."
					type={ValidationType.IS_TOO_SHORT}
					currentValidation={validation.password.password}
				/>
			</li>
			<li>
				<PasswordRequirement
					checked={requirements.hasNumberOrSymbol}
					message="Contiene un número o símbolo."
					type={ValidationType.DONT_CONTAINS_SPECIAL_CHAR}
					currentValidation={validation.password.password}
				/>
			</li>
		</ul>
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
				<PasswordRequirement
					checked={matchPasswords}
					message="Las contraseñas coinciden."
					type={ValidationType.PASSWORDS_DONT_MATCH}
					currentValidation={validation.password.confirmPassword}
				/>
			</li>
		</ul>
	</div>
</div>
