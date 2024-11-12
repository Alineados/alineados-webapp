<script lang="ts">
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';

	import { goto } from '$app/navigation';

	function handleClick() {
		goto('/onboarding/second'); // O '/onboarding/second' según la ruta deseada
	}

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}

	// Select
	import * as Select from '$lib/shared/ui/select/index';

	const fruits = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'grapes', label: 'Grapes' },
		{ value: 'pineapple', label: 'Pineapple' }
	];

	let value = $state('');

	const triggerContent = $derived(fruits.find((f) => f.value === value)?.label ?? 'Select a fruit');
	const trigerWhatsAppNumber = $derived(fruits.find((f) => f.value === value)?.label ?? '😎');

	// Checkbox
	import { Checkbox } from '$lib/shared/ui/checkbox/index';
	let checked = $state(false);
</script>

<div class="flex h-full w-full flex-col items-start justify-center">
	<div class="flex w-full flex-col gap-3">
		<h2 class="text-3xl font-semibold text-alineados_gray-900">Datos Personales</h2>
		<hr class="w-full border-spacing-1 border-alineados_gray-200" />
	</div>

	<div class="mt-9 flex w-full flex-col gap-9">
		<div class="flex gap-6">
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="first-name">Nombre</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 text-sm font-normal placeholder:text-alineados_gray-500"
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
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 text-sm font-normal placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
		</div>
		<div class="flex gap-6">
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
		</div>
		<div class="flex gap-6">
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="email">Correo electrónico</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 text-sm  font-normal placeholder:text-alineados_gray-500"
					id="email"
					placeholder="Ej: jose.penados@gmail.com"
					type="email"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
				<span class="text-xs text-[#C90404]">*El correo electrónico es inválido</span>
			</div>
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">Fecha de Nacimiento</Label>
				<div class="flex">
					<Select.Root type="single" name="favoriteFruit" bind:value>
						<Select.Trigger
							class="w-1/3 border-alineados_gray-100 bg-alineados_gray-50 text-alineados_gray-900 focus:outline-none focus:ring-2 focus:ring-alineados_gray-100 data-[placeholder]:text-alineados_gray-500"
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
					<Select.Root type="single" name="favoriteFruit" bind:value>
						<Select.Trigger
							class="w-1/3 border-alineados_gray-100 bg-alineados_gray-50 text-alineados_gray-900 focus:outline-none focus:ring-2 focus:ring-alineados_gray-100 data-[placeholder]:text-alineados_gray-500"
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
					<Select.Root type="single" name="favoriteFruit" bind:value>
						<Select.Trigger
							class="w-1/3 border-alineados_gray-100 bg-alineados_gray-50 text-alineados_gray-900 focus:outline-none focus:ring-2 focus:ring-alineados_gray-100 data-[placeholder]:text-alineados_gray-500"
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
			</div>
		</div>
		<div class="flex gap-6">
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name"
					>Celular <span class="text-xs font-medium">(Opcional)</span></Label
				>
				<div class="flex">
					<Select.Root type="single" name="favoriteFruit" bind:value>
						<Select.Trigger
							class="w-1/6 border-white bg-[#0F172A] text-alineados_gray-900 focus:outline-none focus:ring-2 focus:ring-alineados_gray-100 data-[placeholder]:text-white"
						>
							{trigerWhatsAppNumber}
						</Select.Trigger>
						<Select.Content>
							<Select.Group class="bg-alineados_gray-100">
								<Select.GroupHeading>Países</Select.GroupHeading>
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

					<Input
						class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
						id="last-name"
						type="last-name"
						autocapitalize="none"
						autocorrect="off"
						disabled={isLoading}
					/>
				</div>
			</div>
			<div class="w-1/2 space-y-2">
				<div class="flex items-center justify-between">
					<Label class="text-lg font-semibold text-black" for="last-name"
						>WhatsApp <span class="text-xs font-medium">(Opcional)</span></Label
					>
					<div class="flex items-center space-x-2">
						<Checkbox
							id="terms"
							bind:checked
							aria-labelledby="terms-label"
							class="h-3 w-3 rounded border-gray-300 text-green-500 focus:ring-green-500"
							checkSize="h-3 w-3"
						/>
						<Label id="terms-label" for="terms" class="text-xs font-medium text-alineados_gray-600">
							Mismo que celular
						</Label>
					</div>
				</div>

				<div class="flex">
					<Select.Root type="single" name="favoriteFruit" bind:value>
						<Select.Trigger
							class="w-1/6 border-white bg-[#0F172A] text-alineados_gray-900 focus:outline-none focus:ring-2 focus:ring-alineados_gray-100 data-[placeholder]:text-white"
						>
							{trigerWhatsAppNumber}
						</Select.Trigger>
						<Select.Content>
							<Select.Group class="bg-alineados_gray-100">
								<Select.GroupHeading>Países</Select.GroupHeading>
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

					<Input
						class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
						id="last-name"
						type="last-name"
						autocapitalize="none"
						autocorrect="off"
						disabled={isLoading}
					/>
				</div>
			</div>
		</div>
	</div>
</div>
