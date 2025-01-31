<script lang="ts">
	import { goto } from '$app/navigation';
	import AlertDialog from '$lib/components/AlertDialog.svelte';
	import NewButton from '../NewButton.svelte';

	let {
		status,
		isSave = $bindable(),
		title = $bindable()
	}: {
		status: 'new' | 'edit' | 'see';
		isSave?: boolean;
		title?: string;
	} = $props();

	let openModal = $state(false);

	function handleGoBack() {
		goto('/personal/stories');
	}
</script>

<div class="flex flex-col gap-2 px-4 md:px-8 lg:px-16">
	<p class="flex flex-row text-sm font-medium text-alineados-gray-600">
		<button
			onclick={() => {
				if (!isSave) openModal = true;
				else handleGoBack();
			}}
			class="text-alineados-gray-600 hover:underline"
		>
			Personal
		</button>
		<!-- <a href="/personal/stories" class="text-alineados-gray-600 hover:underline">Personal</a> -->
		<span class="mx-1">/</span>
		<span class="text-alineados-orange-900">Relatos</span>
		{#if status === 'edit'}
			<span class="mx-1">/</span>
			<span class="text-alineados-gray-600">{title}</span>
		{/if}
	</p>
	<div
		class="flex flex-col gap-5 border-b border-alineados-gray-100 pb-4 lg:flex-row lg:justify-between"
	>
		<div class="flex basis-3/4 items-center gap-2">
			{#if status === 'edit'}
				<input
					placeholder="Ingresa el titulo del nuevo relato"
					type="text"
					maxlength="40"
					bind:value={title}
					class="w-full border-none bg-transparent text-5xl font-bold text-alineados-gray-900 focus:outline-none"
				/>
			{:else}
				<p class="text-4xl font-bold text-alineados-gray-900">Relatos</p>
				<div class="ml-5 flex items-center gap-3"></div>
			{/if}
		</div>

		<div class="flex basis-1/4 flex-row justify-end gap-4 self-start pt-2">
			{#if status === 'new'}
				<NewButton status="new" title="Nuevo Relato" />
			{:else if status === 'edit'}
				<NewButton status="edit" title="Guardar" />
			{:else if status === 'see'}
				<NewButton status="see" title="Editar" />
			{/if}
		</div>
	</div>
</div>

<AlertDialog
	bind:open={openModal}
	title="Información sin guardar"
	description="¿Estás seguro que deseas regresar? Se perderán los cambios realizados."
	cancel="Cancelar"
	action="Regresar"
	handleCancel={() => (openModal = false)}
	handleAction={() => handleGoBack()}
/>
