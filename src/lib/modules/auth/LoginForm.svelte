<script lang="ts">
	import Facebook from '$lib/icons/Facebook.svelte';
	import Google from '$lib/icons/Google.svelte';
	import { Button } from '$lib/shared/ui/button/index';
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';
	import { cn } from '$lib/utils.js';

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}
</script>

<div class={cn('grid gap-6', className)} {...$$restProps}>
	<form on:submit|preventDefault={onSubmit}>
		<div class="grid gap-2">
			<div class="grid gap-4 pb-4">
				<div class="flex flex-col gap-2">
					<Label class="text-xs font-normal text-black" for="text"
						>Correo electrónico / Teléfono</Label
					>
					<Input
						class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 "
						id="text"
						placeholder=""
						type="text"
						autocapitalize="none"
						autocorrect="off"
						disabled={isLoading}
					/>
				</div>
				<div class="flex flex-col">
					<div class="flex flex-col gap-2">
						<Label class="text-xs font-normal text-black" for="password">Contraseña</Label>
						<Input
							class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 "
							id="password"
							placeholder=""
							type="password"
							autocapitalize="none"
							autocomplete="current-password"
							autocorrect="off"
							disabled={isLoading}
						/>
					</div>
					<Button
						href="./change-password"
						variant="ghost"
						class="self-end p-0 text-xs font-normal text-black hover:underline cursor-pointer ">¿Olvidaste tu contraseña?</Button
					>
				</div>
			</div>
			<Button
				type="submit"
				disabled={isLoading}
				class="rounded-lg text-sm font-normal bg-alineados_green  text-white hover:bg-green-600"
			>
				{#if isLoading}
					<!-- <Icons.spinner class="mr-2 h-4 w-4 animate-spin" /> -->
					Cargando...
				{/if}
				Ingresar
			</Button>
		</div>
	</form>
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<span class="w-full border-t border-alineados_gray-200"></span>
		</div>
		<div class="relative flex justify-center text-sm uppercase text-alineados_gray-400">
			<span class="bg-white px-2 text-alineados_gray-400"> O </span>
		</div>
	</div>
	<div class="flex flex-col gap-4">
		<Button
			variant="outline"
			type="button"
			class="border-none bg-alineados_gray-100 font-normal text-xs text-black hover:bg-alineados_gray-200"
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
			class="border-none bg-alineados_gray-100 font-normal text-xs text-black hover:bg-alineados_gray-200"
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
		href="./register"
		variant="ghost"
		class="-mt-5 flex flex-row gap-1 text-xs
	 font-normal text-black cursor-pointer"
		>¿No tienes una cuenta?
		<span class="text-[#E67635] hover:underline ">Regístrate</span>
	</Button>
</div>
