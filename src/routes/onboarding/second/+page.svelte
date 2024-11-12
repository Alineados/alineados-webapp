<script lang="ts">
	// Input
	import * as InputOTP from '$lib/shared/ui/input-otp/index';
	import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'bits-ui';
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
	<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} class="mt-12">
		{#snippet children({ cells })}
			{#each cells.slice(0, 1) as cell}
				<InputOTP.Slot
					class="h-16 w-16 rounded-3xl border-alineados_gray-100 bg-alineados_gray-50  text-3xl font-semibold"
					{cell}
				/>
			{/each}
			{#each cells.slice(1, 2) as cell}
				<InputOTP.Slot
					class="h-16 w-16 rounded-3xl border-alineados_gray-100 bg-alineados_gray-50 text-3xl font-semibold"
					{cell}
				/>
			{/each}
			{#each cells.slice(2, 3) as cell}
				<InputOTP.Slot
					class="h-16 w-16 rounded-3xl border-alineados_gray-100 bg-alineados_gray-50 text-3xl font-semibold"
					{cell}
				/>
			{/each}
			{#each cells.slice(3, 4) as cell}
				<InputOTP.Slot
					class="h-16 w-16 rounded-3xl border-alineados_gray-100 bg-alineados_gray-50 text-3xl font-semibold"
					{cell}
				/>
			{/each}
			{#each cells.slice(4, 5) as cell}
				<InputOTP.Slot
					class="h-16 w-16 rounded-3xl border-alineados_gray-100 bg-alineados_gray-50 text-3xl font-semibold"
					{cell}
				/>
			{/each}
			{#each cells.slice(5, 6) as cell}
				<InputOTP.Slot
					class="h-16 w-16 rounded-3xl border-alineados_gray-100 bg-alineados_gray-50 text-3xl font-semibold"
					{cell}
				/>
			{/each}
		{/snippet}
	</InputOTP.Root>

	<div class="mt-5 flex w-full items-center justify-center gap-1">
		<p class="text-sm font-normal text-[#000000]">¿No recibiste el correo?</p>
		<a class="text-sm font-medium text-[#E67635] underline hover:text-[#e67635b4]" href="/"
			>Enviar de nuevo</a
		>
	</div>
</div>
