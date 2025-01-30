<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import type {
		RecoverPasswordData,
		RecoverPasswordValidation
	} from '$lib/interfaces/Auth.interface';
	import { ValidationType, type ValidationError } from '$lib/interfaces/Validations.interface';
	import { Button } from '$lib/shared/ui/button/index';
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';
	import { getValidationMessage } from '$lib/utils/validationsMessage';
	import Header from './components/Header.svelte';
	import EyeOff from '$lib/icons/BlockEye.svelte';
	import Eye from '$lib/icons/NoBlockEye.svelte';
	import Confirm from '$lib/icons/Confirm.svelte';

	// Props
	let {
		data = $bindable(),
		dataJSON = $bindable(),
		validation = $bindable()
	}: {
		data: RecoverPasswordData;
		dataJSON: string;
		validation: RecoverPasswordValidation;
	} = $props();

	// States
	let isPasswordVisible = $state(false);

	function togglePasswordVisibility() {
		isPasswordVisible = !isPasswordVisible;
	}
</script>

<div class="grid gap-6">
	<Header
		title="Restablecer contraseña"
		description="Ingresa tu nueva contraseña para restablecer tu cuenta."
		isBackButton
	/>
	<div class="grid gap-6">
		<form
			method="POST"
			use:enhance={({}) => {
				return async ({ result }) => {
					// If there is an error in the form
					if (result.type === 'success' && result.data && result.data.type === 'error') {
						validation.password = (result.data.validation as RecoverPasswordValidation).password;
						validation.confirmPassword = (
							result.data.validation as RecoverPasswordValidation
						).confirmPassword;
					}

					// If there is a redirect to dashboard
					if (result.type === 'redirect') {
						goto(result.location);
					}
				};
			}}
		>
			<input type="hidden" name="data" value={dataJSON} />
			<div class="grid gap-5">
				<div class="grid gap-8 pb-4">
					<div class="relative flex flex-col gap-2">
						<Label class="text-xs font-normal text-black" for="text">Nueva contraseña</Label>
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
								oninput={(e) => {
									validation.password = ValidationType.ALL_GOOD;
								}}
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
						{#if validation.password !== ValidationType.ALL_GOOD}
							<ErrorMessage isError>
								{#snippet erroMessage()}
									{getValidationMessage(validation.password)}
								{/snippet}
							</ErrorMessage>
						{/if}
					</div>
					<div class="relative flex flex-col gap-2">
						<Label class="text-xs font-normal text-black" for="text">Confirmar contraseña</Label>
						<div class="relative w-full">
							<Input
								class="rounded-lg border-alineados-gray-100  bg-alineados-gray-50 placeholder:text-alineados-gray-200"
								id="confirm-password"
								placeholder="Ingrese su contraseña"
								type={isPasswordVisible ? 'text' : 'password'}
								autocapitalize="none"
								autocomplete="current-password"
								autocorrect="off"
								bind:value={data.confirmPassword}
								oninput={(e) => {
									validation.confirmPassword = ValidationType.ALL_GOOD;
								}}
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
						{#if validation.confirmPassword !== ValidationType.ALL_GOOD}
							<ErrorMessage isError>
								{#snippet erroMessage()}
									{getValidationMessage(validation.confirmPassword)}
								{/snippet}
							</ErrorMessage>
						{/if}
					</div>
				</div>

				<Button
					type="submit"
					class="rounded-lg bg-[#00B85C] text-sm  font-normal text-white hover:bg-green-600"
					formaction={`?/restore`}
				>
					Ingresar
				</Button>
			</div>
		</form>
	</div>
</div>
