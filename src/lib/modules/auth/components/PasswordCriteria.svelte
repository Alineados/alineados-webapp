<script lang="ts">
	import Confirm from '$lib/icons/Confirm.svelte';
	import Cross from '$lib/icons/CircleCrossSolid.svelte';
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-row items-center gap-2">
		<Cross styleTw="size-5 lex-shrink-0" />
		<p class="text-xs font-medium text-alineados-gray-600">
			Fortaleza de la contraseña: <span class="text-xs font-medium text-[#D90D0D]">débil</span>
		</p>
	</div>
	<div class="flex flex-row items-center gap-2">
		<Confirm class="size-5 flex-shrink-0" />
		<p class="text-xs font-medium text-[#7BB026]">
			No puede contener tu nombre o dirección de correo electrónico
		</p>
	</div>
	<div class="flex flex-row items-center gap-2">
		<Confirm class="lex-shrink-0 size-5" />
		<p class="text-xs font-medium text-[#7BB026]">Al menos 8 caracteres</p>
	</div>
	<div class="flex flex-row items-center gap-2">
		<Confirm class="lex-shrink-0 size-5" />
		<p class="text-xs font-medium text-[#7BB026]">Contiene un número o símbolo</p>
	</div>
</div>
