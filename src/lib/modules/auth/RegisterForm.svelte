<script lang="ts">
	import Facebook from '$lib/icons/Facebook.svelte';
	import Google from '$lib/icons/Google.svelte';
	import Mail from '$lib/icons/Mail.svelte';
	import { Button } from '$lib/shared/ui/button/index';
	import { cn } from '$lib/utils.js';

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;
</script>

<div class={cn('grid gap-6', className)} {...$$restProps}>
	<div class="flex flex-col gap-4">
		<Button
			variant="outline"
			type="button"
			class="border-none bg-alineados-gray-100 text-xs font-normal text-black hover:bg-alineados-gray-200"
			disabled={isLoading}
		>
			{#if isLoading}
				<!-- <Icons.spinner class="mr-2 h-4 w-4 animate-spin" /> -->
				Cargando...
			{:else}
				<Mail class="mr-2 h-4 w-4" />
			{/if}
			Ingresa con Correo Electrónico o Celular
		</Button>
		<Button
			variant="outline"
			type="button"
			class="border-none bg-alineados-gray-100 text-xs font-normal text-black hover:bg-alineados-gray-200"
			disabled={isLoading}
		>
			{#if isLoading}
				<!-- <Icons.spinner class="mr-2 h-4 w-4 animate-spin" /> -->
				Cargando...
			{:else}
				<Google class="mr-2 h-4 w-4" />
			{/if}
			Ingresa con Google
		</Button>
		<Button
			variant="outline"
			type="button"
			class="border-none bg-alineados-gray-100 text-xs font-normal text-black hover:bg-alineados-gray-200"
			disabled={isLoading}
		>
			{#if isLoading}
				<!-- <Icons.spinner class="mr-2 h-4 w-4 animate-spin" /> -->
				Cargando...
			{:else}
				<Facebook class="mr-2 h-4 w-4" />
			{/if}
			Ingresa con Facebook
		</Button>
	</div>

	<Button
		href="./login"
		variant="ghost"
		class="-mt-5 flex cursor-pointer flex-row gap-1 
	 text-xs font-normal text-black"
		>¿Tienes una cuenta?
		<span
			class="cursor-pointer text-[#E67635] hover:underline
		 ">Inicia sesión</span
		>
	</Button>
</div>
