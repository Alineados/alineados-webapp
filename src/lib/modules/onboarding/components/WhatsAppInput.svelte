<script lang="ts">
	import { Checkbox } from '$lib/shared/ui/checkbox/index';
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/shared/ui/command/index.js';
	import * as Popover from '$lib/shared/ui/popover/index.js';
	import { Button } from '$lib/shared/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type {
		OnboardingValidation,
		RegisterValidation,
		PhoneNumber
	} from '$lib/interfaces/Onboarding.interface';
	import { ValidationType } from '$lib/interfaces/Onboarding.interface';

	// Props
	let {
		inputKey,
		label,
		options = [],
		value = $bindable(),
		pastPhoneNumber = $bindable(),
		validation = $bindable(),
		contactNotRequired = false
	}: {
		inputKey: string;
		label: string;
		options: { value: string; label: string; flag: string }[];
		value: PhoneNumber;
		pastPhoneNumber: PhoneNumber;
		validation: OnboardingValidation;
		contactNotRequired: boolean;
	} = $props();

	// Derived
	let keyString = $derived(inputKey) as keyof RegisterValidation;

	// States
	let placeholder = 'País';
	let isChecked = $state(false);

	let countryCode = $state(value.code);
	let phoneNumber = $state(value.number);

	let isInvalid = $state(false);
	let errorMessage = $state('');

	// Shadcn
	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(options.find((f) => f.value === countryCode));

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	// Update value object when either part changes
	$effect(() => {
		if (isChecked) {
			countryCode = pastPhoneNumber.code;
			phoneNumber = pastPhoneNumber.number;
		} else {
			countryCode = '';
			phoneNumber = '';
		}
	});

	$effect(() => {
		value = {
			code: countryCode,
			number: phoneNumber
		};
	});

	// Regex
	const phoneRegex = /^\d{1,}$/;

	// Validation function
	function validatePhoneNumber() {
		// Required validation
		Object.keys(validation.register).forEach((key) => {
			if (key === inputKey) {
				validation.register[keyString] = ValidationType.ALL_GOOD;
			}
		});

		// Phone number validation
		if (phoneNumber.length === 0) {
			isInvalid = false;
			errorMessage = '';
		} else if (!phoneRegex.test(phoneNumber)) {
			isInvalid = true;
			errorMessage = '*solo se aceptan números';
		} else {
			isInvalid = false;
			errorMessage = '';
		}
	}
</script>

<div class="relative flex w-1/2 flex-col gap-2">
	<div class="flex items-center justify-between">
		<Label
			class={`text-lg font-semibold ${contactNotRequired ? 'text-alineados-gray-300' : 'text-black'}`}
			for={inputKey}
		>
			{label}
		</Label>
		<div class="flex items-center space-x-2">
			<Checkbox
				id="terms"
				aria-labelledby="terms-label"
				class="h-3 w-3 rounded border-gray-300 text-green-500 focus:ring-green-500"
				checkSize="h-3 w-3"
				disabled={contactNotRequired}
				bind:checked={isChecked}
			/>
			<Label
				id="terms-label"
				for="terms"
				class={`text-xs font-medium ${contactNotRequired ? 'text-alineados-gray-300' : 'text-alineados-gray-600'}`}
			>
				Mismo que celular
			</Label>
		</div>
	</div>

	<div class="flex">
		<Popover.Root bind:open>
			<Popover.Trigger bind:ref={triggerRef} disabled={contactNotRequired}>
				{#snippet child({ props })}
					<Button
						variant="outline"
						class="w-[103px] justify-between rounded-lg border-alineados-gray-200  bg-alineados-gray-100 text-sm font-normal text-black hover:bg-alineados-gray-100  hover:text-black"
						{...props}
						role="combobox"
						aria-expanded={open}
					>
						{#if !selectedValue}
							{placeholder}
						{:else}
							<div class="flex items-center gap-2">
								<img class="size-5" src={selectedValue.flag} alt={selectedValue.label} />
							</div>
						{/if}
						<ChevronsUpDown class="opacity-50" />
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class={`w-[140px] bg-alineados-gray-50 p-0`}>
				<Command.Root>
					<Command.Input {placeholder} />
					<Command.List>
						<Command.Empty>País no encontrado.</Command.Empty>
						<Command.Group class="bg-alineados-gray-100">
							{#each options as option}
								<Command.Item
									value={option.label}
									class="bg-alineados-gray-50"
									onSelect={() => {
										countryCode = option.value;

										Object.keys(validation.register).forEach((key) => {
											if (key === inputKey) {
												validation.register[keyString] = ValidationType.ALL_GOOD;
											}
										});

										closeAndFocusTrigger();
									}}
								>
									<Check class={cn(countryCode !== option.value && 'text-transparent')} />
									<div class="flex items-center gap-2">
										<img class="size-5" src={option.flag} alt={option.label} />
										<span class="text-base">{option.value}</span>
									</div>
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>

		<!-- Input to the number -->
		<Input
			class="w-1/6 rounded-lg border-alineados-gray-100 bg-alineados-gray-50 text-center text-base placeholder:text-alineados-gray-500"
			id={`${inputKey}-code`}
			type="tel"
			autocapitalize="none"
			autocorrect="off"
			placeholder="+000"
			oninput={validatePhoneNumber}
			disabled={contactNotRequired}
			bind:value={countryCode}
		/>
		<Input
			class="rounded-lg border-alineados-gray-100 bg-alineados-gray-50 text-base placeholder:text-alineados-gray-500"
			id={`${inputKey}-number`}
			type="tel"
			placeholder="Ingrese su número de celular"
			autocapitalize="none"
			autocorrect="off"
			oninput={validatePhoneNumber}
			disabled={contactNotRequired}
			bind:value={phoneNumber}
		/>
	</div>

	{#if isInvalid || validation.register[keyString] !== ValidationType.ALL_GOOD}
		<span class="absolute -bottom-3 left-1 text-xs text-[#C90404]" style="opacity: 1; height: 1em;">
			{#if validation.register[keyString] === ValidationType.REQUIRED_PHONE_CODE}
				*código de país requerido
			{:else if validation.register[keyString] === ValidationType.REQUIRED}
				*número de celular requerido
			{:else if validation.register[keyString] === ValidationType.INVALID_PHONE_NUMBER}
				*número de celular inválido
			{:else}
				{errorMessage}
			{/if}
		</span>
	{/if}
</div>
