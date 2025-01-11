<script lang="ts">
	import type { OnboardingValidation, Email, Register } from '$lib/interfaces/Onboarding.interface';
	import CodeVerification from '$lib/modules/onboarding/components/CodeVerification.svelte';

	// Props
	let {
		registerData = $bindable(),

		emailVerification = $bindable(),
		validation = $bindable()
	}: {
		registerData: Register;
		emailVerification: Email;
		validation: OnboardingValidation;
	} = $props();
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<div class="flex w-full flex-col items-center justify-center gap-4">
		<h2 class="text-3xl font-semibold">
			<span class="text-[#0FC917]">Verificación</span>
			<span class="text-[#000000]"> Correo Electrónico</span>
		</h2>
		<p class="w-[400px] text-pretty text-center text-base font-medium text-[#000000]">
			Hemos enviado un código a tu correo electrónico <strong>{registerData.email}</strong>,
			ingrésalo para verificarlo
		</p>
	</div>

	<CodeVerification bind:value={emailVerification.code} bind:validation />

	<div class="mt-10 flex w-full items-center justify-center gap-1">
		<p class="text-sm font-normal text-[#000000]">¿No recibiste el correo?</p>
		<a class="text-sm font-medium text-[#E67635] underline hover:text-[#e67635b4]" href="/"
			>Enviar de nuevo</a
		>
	</div>
</div>
