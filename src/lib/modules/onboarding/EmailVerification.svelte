<script lang="ts">
	import CodeVerification from '$lib/modules/onboarding/components/CodeVerification.svelte';
	//const customPattern: RegExp = /^[0-9]+$/; // Asegúrate de que sea de tipo RegExp
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<div class="flex w-full flex-col items-center justify-center gap-4">
		<h2 class="text-3xl font-semibold">
			<span class="text-[#0FC917]">Verificación</span>
			<span class="text-[#000000]"> Correo Electrónico</span>
		</h2>
		<p class="w-[400px] text-pretty text-center text-base font-medium text-[#000000]">
			Hemos enviado un código a tu correo electrónico <strong>jose.penagos@alineado.org</strong>,
			ingrésalo para verificarlo
		</p>
	</div>

	<CodeVerification maxlength={6} />

	<div class="mt-5 flex w-full items-center justify-center gap-1">
		<p class="text-sm font-normal text-[#000000]">¿No recibiste el correo?</p>
		<a class="text-sm font-medium text-[#E67635] underline hover:text-[#e67635b4]" href="/"
			>Enviar de nuevo</a
		>
	</div>
</div>
