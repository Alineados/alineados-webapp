<script lang="ts">
	import RegisterInput from '$lib/modules/onboarding/components/RegisterInput.svelte';
	import RegisterSelect from '$lib/modules/onboarding/components/RegisterSelect.svelte';
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

	// Form data
	let firstName = '';
	let lastName = '';
	let countryOfResidence = '';
	let countryOfBirth = '';
	let email = '';
	let birthday = '';
	let phoneNumber = '';
	let whatsappNumber = '';
</script>

<div class="flex h-full w-full flex-col items-start justify-center">
	<Header title="Datos Personales" />

	<form action="/?/username" method="POST" class="mt-9 flex w-full flex-col gap-7">
		<div class="flex gap-6">
			<RegisterInput
				label="Nombre"
				forId="first-name"
				placeholder="Ingrese su nombre"
				type="text"
				bind:value={firstName}
			/>
			<RegisterInput
				label="Apellido"
				forId="last-name"
				placeholder="Ingrese su apellido"
				type="text"
				bind:value={lastName}
			/>
		</div>
		<div class="flex gap-6">
			<RegisterCombobox
				label="País de Residencia"
				name="country-of-residence"
				options={countries}
				placeholder="Selecciona un país"
			/>
			<RegisterCombobox
				label="País de Nacimiento"
				name="country-of-birth"
				options={countries}
				placeholder="Selecciona un país"
			/>
		</div>
		<div class="flex gap-6">
			<RegisterInput
				label="Correo Electrónico"
				forId="email"
				placeholder="Ingrese su correo electrónico"
				type="email"
			/>
			<BirthdaySelect label="Fecha de Nacimiento" />
		</div>
		<div class="flex gap-6">
			<PhoneInput label="Celular" name="phone-number" placeholder="País" options={countriesCode} />
			<WhatsAppInput
				label="WhatsApp"
				name="whatsapp-number"
				placeholder="País"
				options={countriesCode}
			/>
		</div>
	</form>
</div>
