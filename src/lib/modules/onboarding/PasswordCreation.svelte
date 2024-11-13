<script lang="ts">
	import Header from '$lib/modules/onboarding/components/Header.svelte';
	import PasswordInput from '$lib/modules/onboarding/components/PasswordInput.svelte';
	import PasswordRequirement from '$lib/modules/onboarding/components/PasswordRequirement.svelte';

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}
</script>

<div class="flex h-full w-full flex-col items-start justify-center">
	<Header title="Creación de Contraseña" />
	<div class="mt-9 flex w-full flex-col gap-11">
		<PasswordInput label="Contraseña" id="password" placeholder="Ingrese su contraseña" />
		<PasswordInput
			label="Confirmar Contraseña"
			id="confirm-password"
			placeholder="Confirme su contraseña"
		/>
	</div>

	<div class="mt-4">
		<ul class="space-y-1">
			<li>
				<PasswordRequirement icon="cross" text="Fortaleza de la contraseña:" highlight="débil" />
			</li>
			<li>
				<PasswordRequirement
					icon="check"
					text="No puede contener tu nombre o dirección de correo electrónicos"
				/>
			</li>
			<li>
				<PasswordRequirement icon="check" text="Mínimo 8 caracteres" />
			</li>
			<li>
				<PasswordRequirement
					icon="check"
					text="Contiene un número o símbolo"
					highlightColor="#7BB026"
				/>
			</li>
			<li>
				<PasswordRequirement icon="check" text="Match de contraseñas" />
			</li>
		</ul>
	</div>
</div>
