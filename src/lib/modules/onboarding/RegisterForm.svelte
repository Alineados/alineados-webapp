<script lang="ts">
	import type { OnboardingValidation, Register } from '$lib/interfaces/Onboarding.interface';
	import RegisterInput from '$lib/modules/onboarding/components/RegisterInput.svelte';
	import RegisterCombobox from './components/RegisterCombobox.svelte';
	import BirthdaySelect from '$lib/modules/onboarding/components/BirthdaySelect.svelte';
	import PhoneInput from '$lib/modules/onboarding/components/PhoneInput.svelte';
	import WhatsAppInput from '$lib/modules/onboarding/components/WhatsAppInput.svelte';
	import { Label } from '$lib/shared/ui/label/index.js';
	import { Switch } from '$lib/shared/ui/switch/index.js';
	import { Countries } from '$lib/interfaces/countries';

	// Props
	let {
		register = $bindable(),
		validation = $bindable(),
		isChecked = $bindable()
	}: { register: Register; validation: OnboardingValidation; isChecked: boolean } = $props();
</script>

<div class="flex h-full w-full flex-col items-start justify-center">
	<div class="flex w-full justify-between border-b border-alineados-gray-200 pb-2">
		<h2 class="text-3xl font-semibold text-alineados-gray-900">Datos Personales</h2>
		<div class="flex items-center space-x-2">
			<Label for="form-mode" class=" font-medium text-alineados-gray-800"
				>No comparto contacto</Label
			>
			<Switch id="form-mode" bind:checked={register.contactNotRequired} />
		</div>
	</div>

	<form class="mt-9 flex w-full flex-col gap-7">
		<div class="flex gap-6">
			<RegisterInput
				label="Nombres"
				inputKey="firstName"
				placeholder="Ingrese su nombre"
				type="text"
				bind:validation
				bind:value={register.firstName}
				contactNotRequired={false}
			/>
			<RegisterInput
				label="Apellidos"
				inputKey="lastName"
				placeholder="Ingrese su apellido"
				type="text"
				bind:validation
				bind:value={register.lastName}
				contactNotRequired={false}
			/>
		</div>
		<div class="flex gap-6">
			<RegisterCombobox
				label="País de Residencia"
				inputKey="countryOfResidence"
				placeholder="Selecciona un país"
				options={Countries}
				bind:validation
				bind:value={register.countryOfResidence}
			/>
			<RegisterCombobox
				label="País de Nacimiento"
				inputKey="countryOfBirth"
				placeholder="Selecciona un país"
				options={Countries}
				bind:validation
				bind:value={register.countryOfBirth}
			/>
		</div>
		<div class="flex gap-6">
			<RegisterInput
				label="Correo Electrónico"
				inputKey="email"
				placeholder="Ingrese su correo electrónico"
				type="email"
				bind:validation
				bind:value={register.email}
				contactNotRequired={register.contactNotRequired}
			/>
			<BirthdaySelect inputKey="birthday" bind:validation bind:value={register.birthday} />
		</div>
		<div class="flex gap-6">
			<PhoneInput
				label="Celular"
				inputKey="phoneNumber"
				options={Countries}
				bind:validation
				bind:value={register.phoneNumber}
				contactNotRequired={register.contactNotRequired}
			/>
			<WhatsAppInput
				label="WhatsApp"
				inputKey="whatsappNumber"
				options={Countries}
				bind:validation
				bind:value={register.whatsappNumber}
				bind:pastPhoneNumber={register.phoneNumber}
				contactNotRequired={register.contactNotRequired}
				bind:isChecked
			/>
		</div>
		<div class="flex gap-6">
			<RegisterInput
				label="Usuario"
				inputKey="username"
				placeholder="Ingrese su nombre de usuario"
				type="text"
				bind:validation
				bind:value={register.username}
				contactNotRequired={false}
			/>
		</div>
	</form>
</div>
