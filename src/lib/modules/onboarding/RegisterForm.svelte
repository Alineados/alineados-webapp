<script lang="ts" module>
	import { z } from 'zod';

	export const formSchema = z.object({
		firstName: z.string().min(2).max(20),
		lastName: z.string().min(2).max(20)
	});
	export type FormSchema = typeof formSchema;
</script>

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
		{
			value: '+502',
			label: 'GT',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/GT.svg'
		},
		{
			value: '+504',
			label: 'HN',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/HN.svg'
		},
		{
			value: '+503',
			label: 'SV',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/SV.svg'
		},
		{
			value: '+505',
			label: 'NI',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/NI.svg'
		},
		{
			value: '+506',
			label: 'CR',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/CR.svg'
		},
		{
			value: '+507',
			label: 'PA',
			flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/PA.svg'
		}
	];

	// Zod
	import SuperDebug, { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { browser } from '$app/environment';
	import * as Form from '$lib/shared/ui/form/index.js';
	import { page } from '$app/stores';

	// Definición del esquema de validación
	const formSchema = z.object({
		firstName: z.string().min(2).max(50)
	});
	type FormSchema = typeof formSchema;

	let { form: data = $page.data.firstName }: { form: SuperValidated<Infer<FormSchema>> } = $props();

	const form = superForm(data, {
		validators: zodClient(formSchema),
		onUpdated: ({ form: f }) => {
			console.log(`Current input value: ${f.data.firstName}`);
		}
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex h-full w-full flex-col items-start justify-center">
	<Header title="Datos Personales" />

	<form action="/?/username" method="POST" use:enhance class="mt-9 flex w-full flex-col gap-9">
		<Form.Field {form} name="firstName">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex gap-6" {...props}>
						<RegisterInput
							label="Nombre"
							forId="first-name"
							placeholder="Ingrese su nombre"
							type="text"
							{...props}
						/>
						<RegisterInput
							label="Apellido"
							forId="last-name"
							placeholder="Ingrese su apellido"
							type="text"
							{...props}
						/>
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
							placeholder="Ingrese su correo electrónico"
							type="email"
						/>
						<BirthdaySelect label="Fecha de Nacimiento" />
					</div>
					<div class="flex gap-6">
						<PhoneInput
							label="Celular"
							name="phone-number"
							placeholder="País"
							options={countriesCode}
						/>
						<WhatsAppInput
							label="WhatsApp"
							name="whatsapp-number"
							placeholder="País"
							options={countriesCode}
						/>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Button>Submit</Form.Button>
		{#if browser}
			<SuperDebug data={$formData} />
		{/if}
	</form>
</div>
