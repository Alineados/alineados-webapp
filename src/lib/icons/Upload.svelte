<script lang="ts">
	import { enhance } from '$app/forms';

	let { styleTw = 'size-6' } = $props();

	let fileInput: HTMLInputElement;
	let files: FileList | null = $state(null);
	let formHtml: HTMLFormElement;

	let error = $state({
		show: false,
		message: ''
	});

	function triggerFileInput() {
		fileInput.click();
	}

	function handleOnChange(e: any) {
		e.stopPropagation();

		if (files && formHtml) formHtml.requestSubmit();
	}
</script>

<form
	class="hidden"
	bind:this={formHtml}
	method="POST"
	action="?/upload"
	enctype="multipart/form-data"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		return async ({ result, update }) => {
			
			console.log('result', result);

			if (result.type === 'failure' && result.status === 400) {
				error = {
					show: true,
					message:
						typeof result.data?.message === 'string' ? result.data.message : 'Ocurrio un error'
				};
			} else if (result.type === 'failure' && result.status === 500) {
				error = {
					show: true,
					message: 'Ocurrio un error'
				};
			} else if (result.type === 'success') {
				// TODO: Add the path to the json
				error = {
					show: false,
					message: ''
				};

				// update the files
				files = null;
			}
		};
	}}
>
	<input
		bind:files
		bind:this={fileInput}
		onchange={handleOnChange}
		name="fileToUpload"
		class="hidden"
		id="file"
		type="file"
		accept="image/*"
	/>
</form>

<!-- {#if files}
	<div class="flex flex-row w-2/3 justify-end items-center gap-2">
		<p class="text-xs text-alineados-gray-600">
			Nombre:
			{files[0].name}
		</p>
		<button
			class="rounded-lg text-xs bg-alineados-blue-900 px-2 py-1 text-white transition duration-300 ease-in-out hover:shadow-lg"
		>
			Subir
		</button>
	</div>
{:else}
{/if} -->
<button aria-label="Upload" class="pt-3" onclick={triggerFileInput}>
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
</button>
