<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import type {
		RecoverPasswordData,
		RecoverPasswordValidation
	} from '$lib/interfaces/Auth.interface';
	import { ValidationType } from '$lib/interfaces/Validations.interface';
	import { Button } from '$lib/shared/ui/button/index';
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';
	import { getValidationMessage } from '$lib/utils/validationsMessage';
	import Header from './components/Header.svelte';

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
</script>

<div>
	<Header
		title="Código de verificación"
		description="Ingresa el código de verificación que te enviamos a tu correo electrónico."
	/>
	<div class="grid gap-6">
		<form
			method="POST"
			use:enhance={({}) => {
				return async ({ result }) => {
					// If there is an error in the form
					if (result.type === 'success' && result.data && result.data.type === 'error') {
						validation.code = result.data.validation as ValidationType;
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
							class="rounded-lg border-alineados-gray-100 bg-alineados-gray-50 placeholder:text-alineados-gray-200"
							id="text"
							placeholder="Ingrese el código de verificación"
							type="text"
							maxlength={6}
							pattern="[0-9]*"
							inputmode="numeric"
							oninput={(e) => {
								e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
							}}
							autocapitalize="none"
							autocorrect="off"
							bind:value={data.code}
						/>
						{#if validation.code !== ValidationType.ALL_GOOD}
							<ErrorMessage isError>
								{#snippet erroMessage()}
									{getValidationMessage(validation.code)}
								{/snippet}
							</ErrorMessage>
						{/if}
					</div>
				</div>

				<Button
					type="submit"
					class="rounded-lg bg-[#00B85C] text-sm  font-normal text-white hover:bg-green-600"
					formaction={`?/code`}
				>
					Ingresar
				</Button>
			</div>
		</form>
	</div>
</div>
