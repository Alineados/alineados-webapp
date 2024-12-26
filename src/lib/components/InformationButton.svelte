<script lang="ts">
	import * as Dialog from '$lib/shared/ui/dialog/index.js';

	import InformationIcon from '$lib/icons/InformationIcon.svelte';

	let { tittle, description } = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<InformationIcon styleTw="size-4" />
	</Dialog.Trigger>
	<Dialog.Content class="bg-white">
		<Dialog.Header>
			<Dialog.Title>{tittle}</Dialog.Title>
			<Dialog.Description>
				{description}
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Dialog.Close
				class="rounded-lg bg-alineados-green-800 px-3 py-2 text-white hover:bg-alineados-green-900"
			>
				¡Entendido!</Dialog.Close
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
