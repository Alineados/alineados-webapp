<script lang="ts">
	import Check from '$lib/icons/AlineadosCheck.svelte';

	import { Button } from '$lib/shared/ui/button/index';
	import * as Card from '$lib/shared/ui/card/index';

	import CardChangePass from './components/CardChangePass.svelte';
	import PasswordCriteria from './components/PasswordCriteria.svelte';
	import PasswordInput from './components/PasswordInput.svelte';

	let isLoading = false;
	let confirmed = true;
</script>

<CardChangePass>
	{#if confirmed}
		<Card.Content class=" my-auto flex flex-col items-center justify-center gap-6">
			<Check styleTw="size-16" />
			<div class="flex flex-col items-center justify-center gap-1">
				<Card.Title class="text-center text-xl font-semibold text-black"
					>Tu contraseña se ha cambiado</Card.Title
				>
				<Card.Description class="text-xs font-medium text-alineados-gray-500"
					>Regresa al inicio de sesión</Card.Description
				>
			</div>
			<Button
				href="./login"
				class="w-4/6 rounded-lg bg-black font-normal  text-white hover:bg-alineados-gray-800"
				>Volver a inicio de sesión</Button
			>
		</Card.Content>
	{:else}
		<Card.Header class="flex flex-col items-center justify-start gap-2 pb-4 ">
			<Check styleTw="size-16" />
			<div class="flex flex-col items-center justify-center gap-1">
				<Card.Title class="text-2xl font-semibold text-black">Cambia tu contraseña</Card.Title>
				<Card.Description class="text-xs font-medium text-alineados-gray-500"
					>Por favor ingrese sus datos</Card.Description
				>
			</div>
		</Card.Header>
		<Card.Content class="pb-9">
			<form class="flex flex-col gap-6">
				<div class="flex flex-col gap-6">
					<PasswordInput id="password" placeholder="Nueva contraseña" />
					<PasswordInput id="password" placeholder="Confirmar contraseña" />
				</div>

				<PasswordCriteria />
			</form>
		</Card.Content>
		<Card.Footer class="flex justify-between">
			<Button
				type="submit"
				disabled={isLoading}
				class="w-full rounded-lg bg-alineados_green text-sm font-normal  text-white hover:bg-green-600"
			>
				{#if isLoading}
					<!-- <Icons.spinner class="mr-2 h-4 w-4 animate-spin" /> -->
					Cargando...
				{/if}
				Ingresar
			</Button>
		</Card.Footer>{/if}
</CardChangePass>
