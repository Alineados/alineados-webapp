<script lang="ts">
	import * as AlertDialog from '$lib/shared/ui/alert-dialog/index.js';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(),
		title,
		description,
		cancel,
		action,
		// content,
		handleAction,
		handleCancel
	}: {
		open?: boolean;
		title: string;
		description: string;
		cancel: string;
		action: string;
		// content: Snippet;
		handleAction: (e: any) => void;
		handleCancel: () => void;
	} = $props();
</script>

<AlertDialog.Root
	{open}
	onOpenChange={() => {
		(open = false), handleCancel();
	}}
>
	<AlertDialog.Content class="w-3/12 rounded  border border-x-alineados-gray-100 bg-white">
		<AlertDialog.Header>
			<AlertDialog.Title class="pb-2 text-center text-2xl font-semibold">{title}</AlertDialog.Title>
			<AlertDialog.Description class="text-center text-sm font-normal text-black">
				{description}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer class="flex flex-row justify-center gap-2 pt-2">
			<AlertDialog.Cancel
				onclick={handleCancel}
				class="w-full rounded-xl text-sm font-normal hover:bg-alineados-blue-900 hover:text-white "
				>{cancel}</AlertDialog.Cancel
			>
			<AlertDialog.Action
				onclick={handleAction}
				class="w-full rounded-xl border border-red-500 text-sm font-normal hover:bg-red-500 hover:text-white "
				>{action}</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
