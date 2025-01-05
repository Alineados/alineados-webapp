<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Facebook from '$lib/icons/Facebook.svelte';
	import Google from '$lib/icons/Google.svelte';
	import type { LoginData } from '$lib/interfaces/Auth.interface';
	import { Button } from '$lib/shared/ui/button/index';
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';
	import { cn } from '$lib/utils.js';

	// Props
	let {
		data = $bindable()
	}: {
		data: LoginData;
	} = $props();

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}

	// JSON representation of the onboarding data
	let loginDataJSON = $state('');

	$effect(() => {
		loginDataJSON = JSON.stringify(data);
	});

	$inspect(data);
</script>

<div class={cn('grid gap-6', className)}>
	<!-- svelte-ignore event_directive_deprecated -->
	<form
		on:submit|preventDefault={onSubmit}
		method="POST"
		use:enhance={({}) => {
			return async ({ result }) => {
				/*
				// If there is an error in the form
				if (result.type === 'success' && result.data && result.data.type === 'error') {
					const fields = result.data.validations as ValidationError[];
					fields.forEach((error: ValidationError) => {
						const { field, errorType } = error as {
							field: keyof RegisterValidation | keyof EmailValidation | keyof PasswordValidation;
							errorType: ValidationType;
						};

						if (result.data?.button === 'register') {
							validation.register[field as keyof RegisterValidation] = errorType;
						} else if (result.data?.button === 'email') {
							validation.email[field as keyof EmailValidation] = errorType;
						} else {
							validation.password[field as keyof PasswordValidation] = errorType;
						}
					});
				}
				// If there is a redirect
				if (result.type === 'redirect') {
					goto(result.location);
				}
				*/
			};
		}}
	>
		<input type="hidden" name="data" value={loginDataJSON} />
		<div class="grid gap-2">
			<div class="grid gap-4 pb-4">
				<div class="flex flex-col gap-2">
					<Label class="text-xs font-normal text-black" for="text"
						>Correo electrónico / Teléfono</Label
					>
					<Input
						class="rounded-lg border-alineados-gray-100  bg-alineados-gray-50 "
						id="text"
						placeholder=""
						type="text"
						autocapitalize="none"
						autocorrect="off"
						disabled={isLoading}
						bind:value={data.identifier}
					/>
				</div>
				<div class="flex flex-col">
					<div class="flex flex-col gap-2">
						<Label class="text-xs font-normal text-black" for="password">Contraseña</Label>
						<Input
							class="rounded-lg border-alineados-gray-100  bg-alineados-gray-50 "
							id="password"
							placeholder=""
							type="password"
							autocapitalize="none"
							autocomplete="current-password"
							autocorrect="off"
							disabled={isLoading}
							bind:value={data.password}
						/>
					</div>
					<Button
						href="./change-password"
						variant="ghost"
						class="cursor-pointer self-end p-0 text-xs font-normal text-black hover:underline "
						>¿Olvidaste tu contraseña?</Button
					>
				</div>
			</div>
			<Button
				type="submit"
				disabled={isLoading}
				class="bg-alineados_green rounded-lg text-sm font-normal  text-white hover:bg-green-600"
				formaction={`?/login`}
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
			<span class="w-full border-t border-alineados-gray-200"></span>
		</div>
		<div class="relative flex justify-center text-sm uppercase text-alineados-gray-400">
			<span class="bg-white px-2 text-alineados-gray-400"> O </span>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<Button
			variant="outline"
			type="button"
			class="border-none bg-alineados-gray-100 text-xs font-normal text-black hover:bg-alineados-gray-200"
			disabled={true}
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
			disabled={true}
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
		href="/onboarding/steps/1"
		variant="ghost"
		class="-mt-5 flex cursor-pointer flex-row gap-1
	 text-xs font-normal text-black"
		>¿No tienes una cuenta?
		<span class="text-[#E67635] hover:underline">Regístrate</span>
	</Button>
</div>
