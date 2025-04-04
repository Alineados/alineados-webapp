<script lang="ts">
	import * as AlertDialog from '$lib/shared/ui/alert-dialog/index.js';

	let {
		open = $bindable(),
		title,
		description,
		action = 'Aceptar',
		handleAction
	}: {
		open?: boolean;
		title: string;
		description: string;
		action?: string;
		handleAction: () => void;
	} = $props();
</script>

<AlertDialog.Root
	{open}
	onOpenChange={() => {
		open = false;
		handleAction();
	}}
>
	<AlertDialog.Content class="w-3/12 rounded border border-x-alineados-gray-100 bg-white">
		<AlertDialog.Header>
			<AlertDialog.Title class="pb-2 text-center text-2xl font-semibold">{title}</AlertDialog.Title>
			<AlertDialog.Description class="text-center text-sm font-normal text-black">
				{description}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer class="flex flex-row justify-center pt-2">
			<AlertDialog.Action
				onclick={handleAction}
				class="w-full rounded-xl bg-alineados-blue-900 text-sm font-normal text-white hover:bg-alineados-blue-700"
			>
				{action}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>