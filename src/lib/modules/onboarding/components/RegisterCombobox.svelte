<script lang="ts">
	import { Label } from '$lib/shared/ui/label/index';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/shared/ui/command/index.js';
	import * as Popover from '$lib/shared/ui/popover/index.js';
	import { Button } from '$lib/shared/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { OnboardingValidation, RegisterValidation } from '$lib/interfaces/onbarding';

	// Props
	let {
		inputKey,
		label,
		placeholder,
		options,
		value = $bindable(),
		validation = $bindable()
	}: {
		inputKey: string;
		label: string;
		placeholder: string;
		options: { value: string; label: string; flag: string }[];
		value: string;
		validation: OnboardingValidation;
	} = $props();

	// Derived
	let keyString = $derived(inputKey) as keyof RegisterValidation;

	// Shadcn
	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(options.find((f) => f.value === value));

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<div class="relative flex w-1/2 flex-col gap-2">
	<Label class="text-lg font-semibold text-black" for={inputKey}>{label}</Label>

	<Popover.Root bind:open>
		<Popover.Trigger bind:ref={triggerRef}>
			{#snippet child({ props })}
				<Button
					variant="outline"
					class={`w-full justify-between rounded-lg border-alineados-gray-100 bg-alineados-gray-50 text-base font-normal hover:bg-alineados-gray-50 ${selectedValue ? 'text-black' : 'text-alineados-gray-500 hover:text-alineados-gray-500'}`}
					{...props}
					role="combobox"
					aria-expanded={open}
				>
					{#if !selectedValue}
						{placeholder}
					{:else}
						<div class="flex items-center gap-2">
							<img class="size-5" src={selectedValue.flag} alt={selectedValue.label} />
							<span class="text-base">{selectedValue.label}</span>
						</div>
					{/if}
					<ChevronsUpDown class="opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class={`w-[495px] bg-alineados-gray-50 p-0`}>
			<Command.Root>
				<Command.Input {placeholder} />
				<Command.List>
					<Command.Empty>País no encontrado.</Command.Empty>
					<Command.Group class="bg-alineados-gray-100">
						{#each options as option}
							<Command.Item
								value={option.value}
								class="bg-alineados-gray-50"
								onSelect={() => {
									value = option.value;
									closeAndFocusTrigger();
								}}
							>
								<Check class={cn(value !== option.value && 'text-transparent')} />
								<div class="flex items-center gap-2">
									<img class="size-5" src={option.flag} alt={option.label} />
									<span class="text-base">{option.label}</span>
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>

	{#if validation.register[keyString]}
		<span class="absolute -bottom-3 left-1 text-xs text-[#C90404]" style="opacity: 1; height: 1em;">
			*campo requerido
		</span>
	{/if}
</div>
