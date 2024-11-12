<script lang="ts">
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}

	// Select
	import * as Select from '$lib/shared/ui/select/index.js';

	const fruits = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'grapes', label: 'Grapes' },
		{ value: 'pineapple', label: 'Pineapple' }
	];

	let value = $state('');

	const triggerContent = $derived(fruits.find((f) => f.value === value)?.label ?? 'Select a fruit');

	// ComboBox
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/shared/ui/command/index.js';
	import * as Popover from '$lib/shared/ui/popover/index.js';
	import { Button } from '$lib/shared/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	const frameworks = [
		{
			frameworkValue: 'sveltekit',
			label: 'SvelteKit'
		},
		{
			frameworkValue: 'next.js',
			label: 'Next.js'
		},
		{
			frameworkValue: 'nuxt.js',
			label: 'Nuxt.js'
		},
		{
			frameworkValue: 'remix',
			label: 'Remix'
		},
		{
			frameworkValue: 'astro',
			label: 'Astro'
		}
	];

	let open = $state(false);
	let frameworkValue = $state('');
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(
		frameworks.find((f) => f.frameworkValue === frameworkValue)?.label
	);

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

<div class="flex h-full w-full flex-col items-start justify-center px-[152px]">
	<div class="flex w-full flex-col gap-3">
		<h2 class="text-3xl font-semibold text-alineados_gray-900">Datos Personales</h2>
		<hr class="w-full border-spacing-1 border-alineados_gray-200" />
	</div>

	<div class="mt-9 flex w-full flex-col gap-11">
		<div class="flex gap-5">
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="first-name">Nombre</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="first-name"
					placeholder="Ej: José"
					type="first-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">Apellido</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
		</div>
		<div class="flex gap-5">
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">País de Residencia</Label>

				<Select.Root type="single" name="favoriteFruit" bind:value>
					<Select.Trigger
						class="w-full border-alineados_gray-100 bg-alineados_gray-50 text-alineados_gray-900 focus:outline-none focus:ring-2 focus:ring-alineados_gray-100 data-[placeholder]:text-alineados_gray-500"
					>
						{triggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group class="bg-alineados_gray-100">
							<Select.GroupHeading>Fruits</Select.GroupHeading>
							{#each fruits as fruit}
								<Select.Item
									class="default-text bg-alineados_gray-50"
									value={fruit.value}
									label={fruit.label}
								>
									{fruit.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">País de nacimiento</Label>

				<Popover.Root bind:open>
					<Popover.Trigger bind:ref={triggerRef}>
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="w-full justify-between border-alineados_gray-100 bg-alineados_gray-50 text-alineados_gray-500"
								{...props}
								role="combobox"
								aria-expanded={open}
							>
								{selectedValue || 'Select a framework...'}
								<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-full">
						<Command.Root>
							<Command.Input placeholder="Search framework..." />
							<Command.List>
								<Command.Empty>No framework found.</Command.Empty>
								<Command.Group>
									{#each frameworks as framework}
										<Command.Item
											value={framework.frameworkValue}
											onSelect={() => {
												frameworkValue = framework.frameworkValue;
												closeAndFocusTrigger();
											}}
										>
											<Check
												class={cn(
													'mr-2 size-4',
													value !== framework.frameworkValue && 'text-transparent'
												)}
											/>
											{framework.label}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
		</div>
		<div class="flex gap-5">
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">Correo electrónico</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">Fecha de Nacimiento</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
		</div>
		<div class="flex gap-5">
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">Celular (Opcional)</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">WhatsApp (Opcional)</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
		</div>
	</div>
	<div class="mt-16 flex w-full justify-end">
		<button class="rounded-2xl bg-[#0FC917] px-11 py-4 text-sm font-semibold text-[#F7F7F7]"
			>Siguiente -></button
		>
	</div>
</div>

<style>
	:global(.popover-content) {
		width: 100%;
	}
</style>
