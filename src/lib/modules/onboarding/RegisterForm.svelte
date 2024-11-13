<script lang="ts">
	import RegisterInput from '$lib/modules/onboarding/components/RegisterInput.svelte';
	import RegisterSelect from '$lib/modules/onboarding/components/RegisterSelect.svelte';
	import BirthdaySelect from '$lib/modules/onboarding/components/BirthdaySelect.svelte';
	import PhoneInput from '$lib/modules/onboarding/components/PhoneInput.svelte';
	import WhatsAppInput from '$lib/modules/onboarding/components/WhatsAppInput.svelte';
	import Header from '$lib/modules/onboarding/components/Header.svelte';

	// Countries
	const countries = [
		{ value: 'gt', label: 'Guatemala' },
		{ value: 'hn', label: 'Honduras' },
		{ value: 'sv', label: 'El Salvador' },
		{ value: 'ni', label: 'Nicaragua' },
		{ value: 'cr', label: 'Costa Rica' },
		{ value: 'pa', label: 'Panamá' }
	];

	// Countries code
	const countriesCode = [
		{ value: '+502', label: 'GT' },
		{ value: '+504', label: 'HN' },
		{ value: '+503', label: 'SV' },
		{ value: '+505', label: 'NI' },
		{ value: '+506', label: 'CR' },
		{ value: '+507', label: 'PA' }
	];
</script>

<div class="flex h-full w-full flex-col items-start justify-center">
	<Header title="Datos Personales" />

	<div class="mt-9 flex w-full flex-col gap-9">
		<div class="flex gap-6">
			<RegisterInput label="Nombre" forId="first-name" placeholder="Ej: José" type="text" />
			<RegisterInput label="Apellido" forId="last-name" placeholder="Ej: Penados" type="text" />
		</div>
		<div class="flex gap-6">
			<RegisterSelect
				label="País de Residencia"
				name="country-of-residence"
				options={countries}
				placeholder="Selecciona un país"
			/>
			<RegisterSelect
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
				placeholder="Ej: jose.penados@gmail.com"
				type="email"
			/>
			<BirthdaySelect label="Fecha de Nacimiento" />
		</div>
		<div class="flex gap-6">
			<PhoneInput label="Celular" name="phone-number" placeholder="Tel" options={countriesCode} />
			<WhatsAppInput
				label="WhatsApp"
				name="whatsapp-number"
				placeholder="Tel"
				options={countriesCode}
			/>
		</div>
	</div>
</div>
