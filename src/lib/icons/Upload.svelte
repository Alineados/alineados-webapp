<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Images, Documents } from '$lib/interfaces';
	import { addMemory, pcid } from '$lib/stores';
	import { toast } from 'svelte-sonner';
	import Loading from './Loading.svelte';
	import Pencil from './Pencil.svelte';
	let {
		styleTw = 'size-6',
		styles = 'pt-3',
		changeIcon = false
	}: {
		styleTw?: string;
		styles?: string;
		changeIcon?: boolean;
	} = $props();

	let fileInput: HTMLInputElement;
	let files: FileList | null = $state(null);
	let formHtml: HTMLFormElement;
	let uploading = $state(false);

	function triggerFileInput() {
		fileInput.click();
	}

	function handleOnChange(e: any) {
		e.stopPropagation();

		if (files && formHtml) formHtml.requestSubmit();
	}

	function showToast(message: string, type: 'success' | 'error') {
		if (type === 'success')
			toast.success(message, {
				duration: 2000
			});
		else if (type === 'error') toast.error(message, { duration: 2000 });
	}
</script>

<form
	class="hidden"
	bind:this={formHtml}
	method="POST"
	action="?/upload"
	enctype="multipart/form-data"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		uploading = true;

		return async ({ result, update }) => {
			if (result.type === 'failure' && result.status === 400) {
				uploading = false;

				showToast('¡Ocurrio un error al subir el documento!', 'error');
			} else if (result.type === 'failure' && result.status === 500) {
				uploading = false;

				showToast('¡Ocurrio un error al subir el documento!', 'error');
			} else if (result.type === 'success') {
				const { data } = result.data ?? {};

				const { document, url } = data as { document: Documents; url: string };

				if (result.data) addMemory(document as unknown as Documents, url);

				showToast('¡Documento subido correctamente!', 'success');

				// update the files
				files = null;

				uploading = false;
			}

			uploading = false;
		};
	}}
>
	<input type="hidden" name="pcid" value={$pcid} />
	<input
		bind:files
		bind:this={fileInput}
		onchange={handleOnChange}
		name="fileToUpload"
		class="hidden"
		id="file"
		type="file"
		accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
	/>
</form>

{#if uploading}
	<div class="h-6 w-6 animate-spin text-white">
		<Loading />
	</div>
{:else}
	<button aria-label="Upload" class={styles} onclick={triggerFileInput}>
		{#if changeIcon}
			<Pencil {styleTw} simple={false} />
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class={styleTw}
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
				/>
			</svg>
		{/if}
	</button>
{/if}
