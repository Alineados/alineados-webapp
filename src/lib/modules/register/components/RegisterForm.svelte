<script lang="ts">
	import Facebook from '$lib/icons/Facebook.svelte';
	import Google from '$lib/icons/Google.svelte';

	// import { Icons } from "$lib/components/docs/index.js";
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
			<div class="grid gap-8">
				<div>
					<Label class="text-sm font-normal text-alineados_gray-900" for="text"
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
					<div>
						<Label class="text-sm font-normal text-alineados_gray-900" for="password"
							>Contraseña</Label
						>
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
					<Button href="alineados.com" variant="ghost" class="self-end font-normal p-0 text-sm "
						>¿Olvidaste tu contraseña?</Button
					>
				</div>
			</div>
			<Button type="submit" disabled={isLoading}>
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
			<span class="w-full border-t"></span>
		</div>
		<div class="relative flex justify-center text-xs uppercase">
			<span class="bg-background px-2 text-muted-foreground"> O </span>
		</div>
	</div>
	<Button variant="outline" type="button" disabled={isLoading}>
		{#if isLoading}
			<!-- <Icons.spinner class="mr-2 h-4 w-4 animate-spin" /> -->
			Cargando...
		{:else}
			<Google class="mr-2 h-4 w-4" />
		{/if}
		Ingresa con Google
	</Button>
	<Button variant="outline" type="button" disabled={isLoading}>
		{#if isLoading}
			<!-- <Icons.spinner class="mr-2 h-4 w-4 animate-spin" /> -->
			Cargando...
		{:else}
			<Facebook class="mr-2 h-4 w-4" />
		{/if}
		Ingresa con Facebook
	</Button>
</div>
