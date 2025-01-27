<script lang="ts">
	import * as AlertDialog from '$lib/shared/ui/alert-dialog/index.js';
	import DatePicker from './DatePicker.svelte';

	let { open = $bindable(), date = $bindable(), confirm } = $props();

	let error = $state({
		error: false,
		message: ''
	});

	function handleConfirm() {
		if (!date) {
			error = {
				error: true,
				message: 'Por favor, selecciona una fecha.'
			};
			return;
		}

		confirm();
	}
</script>

<AlertDialog.Root {open} onOpenChange={() => (open = false)}>
	<AlertDialog.Content class="w-3/12 rounded  border border-x-alineados-gray-100 bg-white">
		<AlertDialog.Header>
			<AlertDialog.Title class="pb-4 text-center text-2xl font-semibold"
				>Fecha meta</AlertDialog.Title
			>
			<AlertDialog.Description class="text-center text-sm font-normal text-black">
				¿Cuál es tu fecha para solucionar este problema?
			</AlertDialog.Description>
		</AlertDialog.Header>

		<DatePicker bind:value={date} bind:error />

		{#if error.error}
			<p class="pl-2 text-sm text-red-500">{error.message}</p>
		{/if}
		<AlertDialog.Footer class="flex flex-row justify-center gap-2 pt-4">
			<AlertDialog.Cancel
				onclick={() => (open = false)}
				class="w-full rounded-xl bg-red-500 text-sm font-normal text-white hover:border-none hover:bg-red-500 hover:text-white "
				>Cancelar</AlertDialog.Cancel
			>
			<AlertDialog.Action
				onclick={handleConfirm}
				class="w-full rounded-xl bg-alineados-blue-900 text-sm font-normal text-white hover:bg-alineados-blue-900"
				>Confirmar</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
