<script lang="ts">
	import { onMount } from 'svelte';
	import { problemsImages, addMemory, removeMemory, problemInfo, pcid } from '$lib/stores';
	import alineadosImage from '$lib/assets/check.png';
	import Plus from '$lib/icons/Plus.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';
	import { enhance } from '$app/forms';
	import { showToast } from '$lib/utils/toast';

	let currentIndex = $state(0);
	let fileInput: HTMLInputElement;
	let formHtml: HTMLFormElement;
	let uploading = $state(false);

	function selectImage(index: number) {
		currentIndex = index;
	}

	function handleOnChange(e: any) {
		e.stopPropagation();
		if (formHtml) formHtml.requestSubmit();
	}

	function removeImage() {
		// Eliminar todas las imágenes usando la función del store
		$problemsImages.forEach((image) => {
			removeMemory(image.id, 'carousel_image');
		});
		currentIndex = 0;
	}

	// Obtener las imágenes con su contenido Base64
	const imagesWithContent = $derived($problemsImages.map(image => {
		const memory = $problemInfo.memories.find(mem => mem.id === image.id);
		return {
			...image,
			content: memory?.content || null
		};
	}));

	function triggerFileInput() {
		fileInput?.click();
	}

	let interval: any;

	onMount(() => {
		// Solo iniciar el intervalo si hay más de una imagen
		if (imagesWithContent.length <= 1) return;
		interval = setInterval(() => {
			const nextIndex = (currentIndex + 1) % imagesWithContent.length;
			currentIndex = nextIndex;
		}, 3000);

		return () => clearInterval(interval);
	});
</script>

<!-- Formulario para subir archivos -->
<form
	class="hidden"
	bind:this={formHtml}
	method="POST"
	action="?/upload"
	enctype="multipart/form-data"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		uploading = true;

		// Limpiar imágenes existentes antes de subir la nueva
		$problemsImages.forEach((image) => {
			removeMemory(image.id, 'image');
		});

		return async ({ result, update }) => {
			if (result.type === 'failure') {
				uploading = false;
				showToast('¡Ocurrió un error al subir la imagen!', 'error');
			} else if (result.type === 'success') {
				const { data } = result.data as {
					data: { document: any; url: string };
				};

				const { document, url } = data;

				if (result.data) {
					// Agregar a memories (mismo lugar que documentos) pero con tipo especial
					addMemory(document, url);
					showToast('¡Imagen subida correctamente!', 'success');
				}

				uploading = false;
			}

			uploading = false;
		};
	}}
>
	<input type="hidden" name="pcid" value={$pcid} />
	<input type="hidden" name="type" value="problems" />

	<input
		bind:this={fileInput}
		disabled={uploading}
		onchange={handleOnChange}
		name="fileToUpload"
		class="hidden"
		id="file"
		type="file"
		accept="image/*"
	/>
</form>

<div class="relative z-10 h-60 w-full overflow-hidden rounded-lg bg-alineados-gray-50">
	{#if imagesWithContent.length === 0}
		<img
			src={alineadosImage}
			alt="alieneados check"
			class="absolute inset-0 h-full w-full rounded-lg object-cover p-1 transition-opacity duration-500"
			style="opacity: {0 === currentIndex ? 1 : 0}"
		/>
		<!-- Botón para agregar imagen cuando no hay ninguna -->
		<button
			onclick={triggerFileInput}
			disabled={uploading}
			class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
			aria-label="Agregar imagen"
		>
			{#if uploading}
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
			{:else}
				<Plus styleTw="size-8 text-white" />
			{/if}
		</button>
	{:else}
		{#each imagesWithContent as image, index}
			<img
				src={image.url}
				alt={`Image ${index + 1}`}
				class="absolute inset-0 h-full w-full rounded-lg object-cover p-1 transition-opacity duration-500"
				style="opacity: {index === currentIndex ? 1 : 0}"
			/>
		{/each}
		<!-- Botón para eliminar imagen cuando hay una -->
		<button
			onclick={removeImage}
			class="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-300"
			aria-label="Eliminar imagen"
		>
			<TrashCan styleTw="size-4 text-white" />
		</button>
	{/if}
</div>
