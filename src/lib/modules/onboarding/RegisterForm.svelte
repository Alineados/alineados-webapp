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

<!-- Contact sharing toggle -->
<div class="mb-6">
    <label class="flex items-center gap-2">
        <input
            type="checkbox"
            bind:checked={register.contactNotRequired}
            class="h-4 w-4 rounded border-gray-300"
        />
        <span>No compartir contacto</span>
    </label>
</div>

{#if !register.contactNotRequired}
    <!-- Personal Information -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- First Name -->
        <Input
            label="Nombres"
            bind:value={register.firstName}
            validation={validation.register.firstName}
            required={true}
        />

        <!-- Last Name -->
        <Input
            label="Apellidos"
            bind:value={register.lastName}
            validation={validation.register.lastName}
            required={true}
        />

        <!-- Email -->
        <Input
            label="Correo electrónico"
            bind:value={register.email}
            validation={validation.register.email}
            required={true}
        />

        <!-- Birthday -->
        <DateInput
            label="Fecha de nacimiento"
            bind:value={register.birthday}
            validation={validation.register.birthday}
            required={true}
        />

        <!-- Phone Number -->
        <PhoneInput
            label="Número de celular"
            bind:value={register.phoneNumber}
            validation={validation.register.phoneNumber}
            required={true}
        />

        <!-- WhatsApp Number -->
        <PhoneInput
            label="Número de WhatsApp"
            bind:value={register.whatsappNumber}
            validation={validation.register.whatsappNumber}
            required={true}
        />
    </div>
{/if}

<!-- Always visible fields -->
<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <!-- Country of Residence -->
    <CountrySelect
        label="País de residencia"
        bind:value={register.countryOfResidence}
        validation={validation.register.countryOfResidence}
        required={true}
    />

    <!-- Country of Birth -->
    <CountrySelect
        label="País de nacimiento"
        bind:value={register.countryOfBirth}
        validation={validation.register.countryOfBirth}
        required={true}
    />

    <!-- Username -->
    <Input
        label="Nombre de usuario"
        bind:value={register.username}
        validation={validation.register.username}
        required={true}
    />
</div>
