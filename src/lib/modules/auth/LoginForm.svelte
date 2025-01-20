<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Facebook from '$lib/icons/Facebook.svelte';
	import Google from '$lib/icons/Google.svelte';
	import type { LoginData } from '$lib/interfaces/Auth.interface';
	import { ValidationType } from '$lib/interfaces/Validations.interface';
	import { Button } from '$lib/shared/ui/button/index';
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';
	import EyeOff from '$lib/icons/BlockEye.svelte';
	import Eye from '$lib/icons/NoBlockEye.svelte';

	// Props
	let {
		data = $bindable(),
		dataJSON = $bindable(),
		uid = $bindable()
	}: {
		data: LoginData;
		dataJSON: string;
		uid: string;
	} = $props();

	// States
	let isErrorer = $state(false);
	let errorMessage = $state('');

	// Password visibility
	let isPasswordVisible = $state(false);

	function togglePasswordVisibility() {
		isPasswordVisible = !isPasswordVisible;
	}

	// Fetching data
	let loading = false;
	let error = '';

	async function post() {
		if (!data.identifier || !data.password) {
			error = 'Por favor, rellena todos los campos';
			return;
		}

		loading = true;
		// https://smw52p39-3000.use2.devtunnels.ms // devtunnels local
		// https://oidc.nexuzdb.com // devtunnels tavito
		const res = await fetch(
			'https://smw52p39-3000.use2.devtunnels.ms/interaction/' + uid + '/login',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: data.identifier,
					password: data.password
				})
			}
		);
		console.log(res);

		if (res.status == 200) {
			const response = await res.json();
			window.location.href = response.redirectTo;
			loading = false;
		} else if (res.status == 204) {
			error = 'Credenciales incorrectas';
		} else {
			loading = false;
			error = 'Ha ocurrido un error';
		}
		loading = false;
	}
</script>

<div class="grid gap-6">
	<form
		method="POST"
		use:enhance={({}) => {
			return async ({ result }) => {
				// If there is an error in the form
				if (result.type === 'success' && result.data && result.data.type === 'error') {
					if (result.data.validation === ValidationType.REQUIRED) {
						isErrorer = true;
						errorMessage = 'Ambas credenciales requeridas.';
					} else if (result.data.validation === ValidationType.INVALID_CREDENTIALS) {
						isErrorer = true;
						errorMessage = 'Credenciales inválidas.';
					} else {
						isErrorer = false;
						errorMessage = '';
					}
				}
				// If there is a redirect to dashboard
				if (result.type === 'redirect') {
					console.log('Redirecting to dashboard...');
					goto(result.location);
				}
			};
		}}
	>
		<input type="hidden" name="data" value={dataJSON} />
		<div class="grid gap-2">
			<div class="grid gap-8 pb-4">
				<div class="relative flex flex-col gap-2">
					<Label class="text-xs font-normal text-black" for="text"
						>Correo electrónico / Teléfono / Usuario</Label
					>
					<Input
						class="rounded-lg border-alineados-gray-100  bg-alineados-gray-50 placeholder:text-alineados-gray-200"
						id="text"
						placeholder="Ingrese su correo electrónico, teléfono o usuario"
						type="text"
						autocapitalize="none"
						autocorrect="off"
						bind:value={data.identifier}
					/>
				</div>
				<div class="flex flex-col">
					<div class="relative flex flex-col gap-2">
						<Label class="text-xs font-normal text-black" for="password">Contraseña</Label>

						<div class="relative w-full">
							<Input
								class="rounded-lg border-alineados-gray-100  bg-alineados-gray-50 placeholder:text-alineados-gray-200"
								id="password"
								placeholder="Ingrese su contraseña"
								type={isPasswordVisible ? 'text' : 'password'}
								autocapitalize="none"
								autocomplete="current-password"
								autocorrect="off"
								bind:value={data.password}
							/>
							<button
								type="button"
								class="absolute inset-y-0 right-0 flex items-center pr-3"
								onclick={togglePasswordVisibility}
							>
								{#if isPasswordVisible}
									<EyeOff class="h-5 w-5 text-alineados-gray-500" />
								{:else}
									<Eye class="h-5 w-5 text-alineados-gray-500" />
								{/if}
							</button>
						</div>
					</div>
					<Button
						href="./change-password/1"
						variant="ghost"
						class="cursor-pointer self-end  p-0 text-xs font-normal text-black hover:underline"
						>¿Olvidaste tu contraseña?</Button
					>
					{#if isErrorer}
						<div class="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd"
								/>
							</svg>
							<span>{errorMessage}</span>
						</div>
					{/if}
				</div>
			</div>

			<Button
				class="rounded-lg bg-[#00B85C] text-sm  font-normal text-white hover:bg-green-600"
				onclick={post}
				type="button"
			>
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
			<Google class="mr-2 h-4 w-4" />
			Ingresa con Google
		</Button>
		<Button
			variant="outline"
			type="button"
			class="border-none bg-alineados-gray-100 text-xs font-normal text-black hover:bg-alineados-gray-200"
			disabled={true}
		>
			<Facebook class="mr-2 h-4 w-4" />
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
