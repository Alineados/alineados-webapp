<script lang="ts">
	import type { OnboardingValidation, Email, Register } from '$lib/interfaces/Onboarding.interface';
	import CodeVerification from '$lib/modules/onboarding/components/CodeVerification.svelte';
	import { enhance } from '$app/forms';

	// Props
	let {
		data = $bindable(),
		registerData = $bindable(),
		emailVerification = $bindable(),
		validation = $bindable()
	}: {
		data: string;
		registerData: Register;
		emailVerification: Email;
		validation: OnboardingValidation;
	} = $props();
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="flex flex-col items-center justify-center gap-8">
		<div class="flex w-full flex-col items-center justify-center gap-8">
			<h2 class="text-4xl font-semibold">
				<span class="text-[#0FC917]">Verificación</span>
				<span class="text-[#000000]"> Correo Electrónico</span>
			</h2>
			<p class="w-[400px] text-pretty text-center text-base font-medium text-[#000000]">
				Hemos enviado un código a tu correo electrónico <strong>{registerData.email}</strong>,
				ingrésalo para verificarlo.
			</p>
		</div>

		<CodeVerification bind:value={emailVerification.code} bind:validation />

		<div class="flex w-full items-center justify-center gap-1">
			<p class="text-sm font-normal text-[#000000]">¿No recibiste el correo?</p>
			<form
				method="POST"
				use:enhance={({}) => {
					return async ({ result }) => {
						if (result.type === 'success' && result.data && result.data.type === 'error') {
				
						}
					};
				}}
			>
				<input name="data" type="text" class="hidden" bind:value={data} />
				<button
					type="submit"
					formaction="?/resend"
					class="text-sm font-medium text-[#E67635] underline hover:text-[#e67635b4]"
				>
					Enviar de nuevo
				</button>
			</form>
		</div>
	</div>
</div>
