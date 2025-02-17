<script lang="ts">
	import { enhance } from '$app/forms';
	import File from '$lib/icons/File.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';
	import type { Documents } from '$lib/interfaces';
	import { getFileType } from '$lib/utils/getFormsData';
	import { showToast } from '$lib/utils/toast';

	let {
		file,
		openModal = $bindable(false),
		handleDelete
	}: {
		file: Documents;
		openModal: boolean;
		handleDelete: () => void;
	} = $props();

	let formHtml: HTMLFormElement;
	let loading: boolean = $state(false);


	function onDeleteClick(e: any) {
		e.preventDefault();
		e.stopPropagation();
		openModal = true;
		handleDelete();
	}
</script>

<form
	method="POST"
	action="?/getUrl"
	bind:this={formHtml}
	class="relative flex items-center justify-between rounded-xl border border-alineados-gray-100 bg-white p-4"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		loading = true;

		return async ({ result, update }) => {
			if (result.type === 'failure' && result.status === 400) {
				showToast('¡Ocurrio un error al subir los documentos!', 'error');
			} else if (result.type === 'failure' && result.status === 500) {
				showToast('¡Ocurrio un error al subir los documentos!', 'error');
			} else if (result.type === 'success') {
				const { data, message, status } = result.data as {
					data: { document: Documents; url: string };
					message: string;
					status: number;
				};

				if (data) {
					const url = data.url;

					window.open(url, '_blank');
				}
			}

			loading = false;
		};
	}}
>
	<div class="flex items-center gap-3">
		<div class="relative">
			<!-- File Icon -->
			<div class="flex h-10 w-10 items-center justify-center rounded bg-alineados-orange-50">
				<File class="size-6 text-alineados-orange-900" />
			</div>
			<!-- ZIP Badge -->
			<span class="absolute -bottom-1 -right-1 rounded bg-blue-500 px-1 text-[10px] text-white">
				{getFileType(file.type)}
			</span>
		</div>
		<div>
			<p class="font-medium">{file.file_name}</p>
			{#if loading}
                <p class="text-xs text-alineados-gray-500 ">
                    Procesando archivo...
                </p>
            {:else}
				<button class="text-xs text-alineados-gray-500 hover:underline" type="submit"
					>Click para descargar o ver</button
				>
			{/if}
		</div>
	</div>
	<!-- Remove Button -->
	<button
		class="rounded-full p-2 text-alineados-gray-400 transition-colors hover:bg-alineados-gray-100 hover:text-alineados-gray-600"
		aria-label="Remove file"
		onclick={(e) => onDeleteClick(e)}
	>
		<TrashCan styleTw="size-5" />
	</button>

	<!-- Input hidden -->
	<input type="hidden" name="document" value={JSON.stringify(file)} />
</form>
