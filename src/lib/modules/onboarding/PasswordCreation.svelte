<script lang="ts">
	import Header from '$lib/modules/onboarding/components/Header.svelte';
	import PasswordInput from '$lib/modules/onboarding/components/PasswordInput.svelte';
	import PasswordRequirement from '$lib/modules/onboarding/components/PasswordRequirement.svelte';
	import PasswordStrengthening from './components/PasswordStrengthening.svelte';

	// Mock data
	let userFirstName = 'José';
	let userLastName = 'Penagos';
	let userEmail = 'jose.penados@gmail.com';

	// Control visibility of confirm password input
	let showConfirmPassword = $state(false);

	// Password and requirements
	let password = $state('');

	let strengthening = $state(0);
	let requirements = $state({
		noNameOrEmail: false,
		minLength: false,
		hasNumberOrSymbol: false
	});

	function normalizeString(str: string): string {
		return str
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
	}

	function evaluatePassword() {
		// Reset requirements and strengthening
		if (password.trim() === '') {
			requirements.noNameOrEmail = false;
			requirements.minLength = false;
			requirements.hasNumberOrSymbol = false;
			strengthening = 0;
			return;
		}

		// Normalize password and user data
		const normalizedPassword = normalizeString(password);
		requirements.noNameOrEmail =
			!normalizedPassword.includes(normalizeString(userFirstName)) &&
			!normalizedPassword.includes(normalizeString(userLastName)) &&
			!normalizedPassword.includes(normalizeString(userEmail));
		requirements.minLength = password.length >= 8;
		requirements.hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);

		strengthening = Object.values(requirements).filter(Boolean).length;

		// Show confirm password input if password is strong
		if (strengthening === 3) {
			showConfirmPassword = true;
		} else {
			showConfirmPassword = false;
		}
	}

	// Confirm password
	let confirmPassword = $state('');

	// Confirm password evaluation
	let matchPasswords = $state(false);

	// Evaluate confirm password
	function evaluateConfirmPassword() {
		if (confirmPassword.trim() === '') return;

		if (confirmPassword === password) {
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
			bind:value={password}
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
	</div>

	<div class="mt-11 flex w-full flex-col gap-4" class:invisible={!showConfirmPassword}>
		<PasswordInput
			label="Confirmar Contraseña"
			id="confirm-password"
			placeholder="Confirme su contraseña"
			bind:value={confirmPassword}
			oninput={evaluateConfirmPassword}
		/>
		<ul class="space-y-1">
			<li>
				<PasswordRequirement checked={matchPasswords} text="Match de contraseñas" />
			</li>
		</ul>
	</div>
</div>
