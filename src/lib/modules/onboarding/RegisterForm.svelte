<script lang="ts">
	let {
		register = $bindable(),
		validation = $bindable()
	}: { register: Register; validation: OnboardingValidation } = $props();

	import type { OnboardingValidation, Register } from '$lib/interfaces/onbarding';
	import RegisterInput from '$lib/modules/onboarding/components/RegisterInput.svelte';
	import RegisterCombobox from './components/RegisterCombobox.svelte';
	import BirthdaySelect from '$lib/modules/onboarding/components/BirthdaySelect.svelte';
	import PhoneInput from '$lib/modules/onboarding/components/PhoneInput.svelte';
	import WhatsAppInput from '$lib/modules/onboarding/components/WhatsAppInput.svelte';
	import Header from '$lib/modules/onboarding/components/Header.svelte';

	// Countries
	const countries = [
		{
			value: 'Guatemala',
			label: 'Guatemala',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/GT.svg'
		},
		{
			value: 'Honduras',
			label: 'Honduras',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/HN.svg'
		},
		{
			value: 'El Salvador',
			label: 'El Salvador',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/SV.svg'
		},
		{
			value: 'Nicaragua',
			label: 'Nicaragua',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/NI.svg'
		},
		{
			value: 'Costa Rica',
			label: 'Costa Rica',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/CR.svg'
		},
		{
			value: 'Panamá',
			label: 'Panamá',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/PA.svg'
		}
	];

	// Countries code
	const countriesCode = [
		{
			value: '+502',
			label: 'Guatemala',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/GT.svg'
		},
		{
			value: '+504',
			label: 'Honduras',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/HN.svg'
		},
		{
			value: '+503',
			label: 'El Salvador',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/SV.svg'
		},
		{
			value: '+505',
			label: 'Nicaragua',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/NI.svg'
		},
		{
			value: '+506',
			label: 'Costa Rica',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/CR.svg'
		},
		{
			value: '+507',
			label: 'Panamá',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/PA.svg'
		}
	];
</script>

<div class="flex h-full w-full flex-col items-start justify-center">
	<Header title="Datos Personales" />

	<form class="mt-9 flex w-full flex-col gap-7">
		<div class="flex gap-6">
			<RegisterInput
				label="Nombres"
				inputKey="firstName"
				placeholder="Ingrese su nombre"
				type="text"
				bind:validation
				bind:value={register.firstName}
			/>
			<RegisterInput
				label="Apellidos"
				inputKey="lastName"
				placeholder="Ingrese su apellido"
				type="text"
				bind:validation
				bind:value={register.lastName}
			/>
		</div>
		<div class="flex gap-6">
			<RegisterCombobox
				label="País de Residencia"
				inputKey="countryOfResidence"
				placeholder="Selecciona un país"
				options={countries}
				bind:validation
				bind:value={register.countryOfResidence}
			/>
			<RegisterCombobox
				label="País de Nacimiento"
				inputKey="countryOfBirth"
				placeholder="Selecciona un país"
				options={countries}
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
			/>
			<BirthdaySelect inputKey="birthday" bind:validation bind:value={register.birthday} />
		</div>
		<div class="flex gap-6">
			<PhoneInput
				label="Celular"
				inputKey="phoneNumber"
				options={countriesCode}
				bind:validation
				bind:value={register.phoneNumber}
			/>
			<WhatsAppInput
				label="WhatsApp"
				inputKey="whatsappNumber"
				options={countriesCode}
				bind:validation
				bind:value={register.whatsappNumber}
			/>
		</div>
	</form>
</div>
