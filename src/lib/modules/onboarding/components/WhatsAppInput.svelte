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

	interface PhoneNumber {
		code: string;
		number: string;
	}

	// Props
	let {
		name,
		label,
		placeholder,
		options = [],
		isInvalid = false,
		errorMessage = '',
		value = $bindable<PhoneNumber>({ code: '', number: '' })
	} = $props();

	let countryCode = $state(value.code);
	let phoneNumber = $state(value.number);
	let isChecked = $state(false);

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
		value = {
			code: countryCode,
			number: phoneNumber
		};
	});
</script>

<div class="flex w-1/2 flex-col gap-0">
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<Label class="text-lg font-semibold text-black" for={name}>
				{label}
			</Label>
			<div class="flex items-center space-x-2">
				<Checkbox
					id="terms"
					bind:checked={isChecked}
					aria-labelledby="terms-label"
					class="h-3 w-3 rounded border-gray-300 text-green-500 focus:ring-green-500"
					checkSize="h-3 w-3"
				/>
				<Label id="terms-label" for="terms" class="text-xs font-medium text-alineados-gray-600">
					Mismo que celular
				</Label>
			</div>
		</div>

		<div class="flex">
			<Popover.Root bind:open>
				<Popover.Trigger bind:ref={triggerRef}>
					{#snippet child({ props })}
						<Button
							variant="outline"
							class="w-[103px] justify-between rounded-lg border-white bg-alineados-gray-50 text-sm font-normal text-white hover:bg-[#0F172A] hover:text-white"
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
				id={`${name}-code`}
				type="tel"
				autocapitalize="none"
				autocorrect="off"
				placeholder="+000"
				bind:value={countryCode}
			/>
			<Input
				class="rounded-lg border-alineados-gray-100 bg-alineados-gray-50 text-base placeholder:text-alineados-gray-500"
				id={`${name}-number`}
				type="tel"
				placeholder="Ingrese su número de celular"
				autocapitalize="none"
				autocorrect="off"
				bind:value={phoneNumber}
			/>
		</div>
	</div>
	<span class="text-xs text-[#C90404]" style="opacity: {isInvalid ? 1 : 0}; height: 1em;">
		{errorMessage}
	</span>
</div>
