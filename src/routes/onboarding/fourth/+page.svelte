<script lang="ts">
	import Welcome from '$lib/images/welcome.webp';
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
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
</div>
