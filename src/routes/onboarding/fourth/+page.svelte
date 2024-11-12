<script lang="ts">
	import Welcome from '$lib/images/welcome.webp';
</script>

<div class="flex h-full w-full flex-col items-center justify-center px-[152px]">
	<div class="flex w-full flex-col items-center justify-center gap-4">
		<h2 class="text-4xl font-semibold text-[#000000]">¡Bienvenido, Jose Penagos!</h2>
		<p class="w-[460px] text-pretty text-center text-lg font-medium text-gray-700">
			Nos complace enormemente que hayas confiado en nosotros para acompañarte en este camino. ¡Es
			hora de estar alineados!
		</p>
	</div>

	<div class="mt-[93px] flex w-full items-center justify-center gap-1">
		<img src={Welcome} alt="Welcome to Alineados" />
	</div>

	<div class="mt-16 flex w-full justify-between">
		<button
			class="flex items-center rounded-2xl border border-alineados_gray-600 px-11 py-4 text-sm font-semibold text-alineados_gray-600"
		>
			<span class="mr-2">&larr;</span> Regresar
		</button>
		<button
			class="flex items-center rounded-2xl bg-[#0FC917] px-11 py-4 text-sm font-semibold text-[#F7F7F7]"
		>
			Siguiente <span class="ml-2">&rarr;</span>
		</button>
	</div>
</div>
