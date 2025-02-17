<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertDialog from '$lib/components/AlertDialog.svelte';
	import DirectoryUpload from '$lib/icons/DirectoryUpload.svelte';
	import File from '$lib/icons/File.svelte';
	import Loading from '$lib/icons/Loading.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';
	import type { Documents } from '$lib/interfaces';
	import { storyState } from '$lib/stores';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import DocumentCard from './DocumentCard.svelte';
	import { showToast } from '$lib/utils/toast';

	let {
		storyType = '',
		type = '', // story | thoughts
		filesList = $bindable([])
	}: {
		storyType: string;
		type: string;
		filesList: Documents[];
	} = $props();

	let fileInput: HTMLInputElement | null = $state(null);
	let files: FileList | null = $state(null);
	let formHtml: HTMLFormElement;
	let uploading = $state(false);
	let openModal = $state(false);
	let documentToDelete: Documents | null = $state(null);

	function handleFileSelect(event: any) {
		event.preventDefault();

		const newFiles = event.target.files;
		if (newFiles) {
			files = newFiles;
			if (formHtml) formHtml.requestSubmit();
		}
	}

	function handleDrop(event: any) {
		event.preventDefault();

		const newFiles = event.dataTransfer.files;
		if (newFiles) {
			files = newFiles;
			if (formHtml) formHtml.requestSubmit();
		}
	}

	function handleDragOver(event: any) {
		event.preventDefault();
	}


	function handleDeleteDocument() {
		if (type === 'story') {
			if (documentToDelete) {
				if (storyType === 'experience') storyState.deleteExperienceDocument(documentToDelete?.id);
				else if (storyType === 'life_lesson')
					storyState.deleteLifeLessonDocument(documentToDelete?.id);
			} else showToast('¡Ocurrio un error al eliminar el documento!', 'error');
		}

		documentToDelete = null;
		openModal = false;
	}

	onMount(() => {
		const dropZone: HTMLElement | null = document.getElementById('drop-zone') as HTMLElement;
		dropZone.addEventListener('dragover', handleDragOver);
		dropZone.addEventListener('drop', handleDrop);
	});
</script>

<div class="w-full px-6 py-2">
	<!-- Drop Zone -->
	<form
		bind:this={formHtml}
		method="POST"
		action="?/uploadMultiple"
		enctype="multipart/form-data"
		id="drop-zone"
		class="rounded-lg border-2 border-dashed border-alineados-gray-300 p-8 text-center {uploading
			? 'opacity-80'
			: ''}"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			uploading = true;

			return async ({ result, update }) => {
				if (result.type === 'failure' && result.status === 400) {
					uploading = false;

					showToast('¡Ocurrio un error al subir los documentos!', 'error');
				} else if (result.type === 'failure' && result.status === 500) {
					uploading = false;

					showToast('¡Ocurrio un error al subir los documentos!', 'error');
				} else if (result.type === 'success') {
					const { data, message, status, type, storyType } = result.data ?? {};

					if (type === 'story') {
						if (result.data) {
							if (storyType === 'experience')
								// append the document list to story experience
								storyState.appendExperienceDocuments(data as unknown as Documents[]);
							else
								// append the document list to story life session
								storyState.appendLifeSessonDocuments(data as unknown as Documents[]);
						}

						showToast('¡Documentos subidos correctamente!', 'success');
					} else if (type === 'thoughts') {
					}
				}

				files = null;
				uploading = false;
			};
		}}
	>
		<div class="flex flex-col items-center gap-4">
			{#if uploading}
				<div class="flex flex-col items-center gap-4 py-16">
					<p class="text-xl font-medium text-alineados-green-900">Subiendo archivos...</p>
					<div class="h-7 w-7 text-white">
						<Loading style="text-alineados-green-900" />
					</div>
				</div>
			{:else}
				<!-- Upload Icon -->
				<div class="flex h-16 w-16 items-center justify-center rounded-lg bg-alineados-green-100">
					<DirectoryUpload />
				</div>

				<!-- Upload Text -->
				<p class="text-sm font-medium text-alineados-gray-600">
					Arrastra tus archivos aquí para iniciar.
				</p>

				<!-- Divider -->
				<div class="flex w-full max-w-xs items-center gap-4">
					<div class="h-[1px] flex-1 bg-alineados-gray-200"></div>
					<span class="text-xl text-alineados-gray-400">o</span>
					<div class="h-[1px] flex-1 bg-alineados-gray-200"></div>
				</div>

				<!-- Browse Button -->
				<button
					class="flex flex-col items-center justify-center gap-2 rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 px-6 py-2 font-medium text-alineados-green-900 transition-colors hover:bg-alineados-green-50"
					onclick={(e: any) => {
						e.preventDefault();
						fileInput?.click();
					}}
				>
					Explorar archivos
				</button>
				<input
					bind:files
					bind:this={fileInput}
					id="file-input"
					type="file"
					multiple
					class="hidden"
					name="fileToUpload"
					accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
					onchange={handleFileSelect}
				/>
			{/if}
		</div>

		<!-- Hidden -->
		<input type="hidden" name="sid" value={storyState.id} />
		<input type="hidden" name="storyType" value={storyType} />
	</form>

	<!-- Uploaded Files Section -->
	<div class="mt-8">
		<h2 class="mb-2 text-xl font-semibold">Archivos subidos</h2>
		<p class="mb-4 text-sm text-alineados-gray-500">
			Archivos compatibles jpg, png, pdf, docx, xlsx, pptx
		</p>

		<!-- File List -->
		<div class="space-y-3">
			{#each filesList as file}
				<DocumentCard {file} bind:openModal handleDelete={() => (documentToDelete = file)} />
			{/each}
		</div>
	</div>
</div>

<AlertDialog
	bind:open={openModal}
	title="Eliminar documento"
	description="¿Estás seguro que deseas eliminar este documento? Se perderá de forma permanente."
	cancel="Cancelar"
	action="Eliminar"
	handleCancel={() => ((openModal = false), (documentToDelete = null))}
	handleAction={() => handleDeleteDocument()}
/>
