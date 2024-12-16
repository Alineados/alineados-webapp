<script lang="ts">
	import * as AlertDialog from '$lib/shared/ui/alert-dialog/index.js';
	import DatePicker from './DatePicker.svelte';

	let { open = false } = $props();

	let date = $state('');

	$inspect({ date });
</script>

<AlertDialog.Root {open}>
	<AlertDialog.Content class="w-3/12 rounded  border border-x-alineados-gray-100 bg-white">
		<AlertDialog.Header>
			<AlertDialog.Title class="pb-7   text-center text-2xl font-semibold"
				>Antes de empezar</AlertDialog.Title
			>
			<AlertDialog.Description class=" text-sm font-semibold text-black">
				¿Cuál es tu fecha meta para solucionar este problema?
			</AlertDialog.Description>
		</AlertDialog.Header>

		<DatePicker bind:value={date} />

		<AlertDialog.Footer class="pt-4">
			<AlertDialog.Action
				class="w-full rounded-xl bg-alineados-blue-900 text-sm font-normal text-white hover:bg-alineados-blue-900"
				>Confirmar</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
