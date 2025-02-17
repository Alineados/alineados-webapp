<script lang="ts">
	import { enhance } from '$app/forms';
	import DirectoryUpload from '$lib/icons/DirectoryUpload.svelte';
	import File from '$lib/icons/File.svelte';
	import Loading from '$lib/icons/Loading.svelte';
	import type { Documents } from '$lib/interfaces';
	import { storyState, thoughtState } from '$lib/stores';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let {
		storyType = '',
		filesList = $bindable([])
	}: {
		storyType: string;
		filesList: Documents[];
	} = $props();

	let fileInput: HTMLInputElement;
	let files: FileList | null = $state(null);
	let formHtml: HTMLFormElement;
	let uploading = $state(false);

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

	function showToast(message: string, type: 'success' | 'error') {
		if (type === 'success')
			toast.success(message, {
				duration: 2000
			});
		else if (type === 'error') toast.error(message, { duration: 2000 });
	}

	function getFileType(type: string): string {
		const typeMap: { [key: string]: string } = {
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
			'application/pdf': 'PDF',
			'application/msword': 'Word',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
			'application/vnd.ms-powerpoint': 'PowerPoint',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
			'image/jpeg': 'jpe',
			'image/png': 'png',
			'application/zip': 'ZIP Archive'
		};

		return typeMap[type] || 'Unknown';
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
							console.log('experience', data);
							if (storyType === 'experience')
								// append the document list to story experience
								storyState.appendExperienceDocuments(data as unknown as Documents[]);
							else
								// append the document list to story life session
								storyState.appendLifeSessonDocuments(data as unknown as Documents[]);
						}

						showToast('¡Documentos subidos correctamente!', 'success');
					} else if (type === 'thoughts')
						if (result.data) {
							thoughtState.appendQualityTimeDocuments(data as unknown as Documents[]);

							showToast('¡Documentos subidos correctamente!', 'success');
						}
					{
					}
				}

				files = null;
				uploading = false;
			};
		}}
	>
		<div class="flex flex-col items-center gap-4">
			{#if uploading}
				<p class="text-base font-medium text-alineados-green-900">Subiendo archivos...</p>
				<div class="h-7 w-7 text-white">
					<Loading style="text-alineados-green-900" />
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
		<input type="hidden" name="tid" value={thoughtState.id} />
		<input type="hidden" name="thoughtType" value="qualityTime" />
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
				<div
					class="flex items-center justify-between rounded-xl border border-alineados-gray-100 bg-white p-4"
				>
					<div class="flex items-center gap-3">
						<div class="relative">
							<!-- File Icon -->
							<div
								class="flex h-10 w-10 items-center justify-center rounded bg-alineados-orange-50"
							>
								<File class="size-6 text-alineados-orange-900" />
							</div>
							<!-- ZIP Badge -->
							<span
								class="absolute -bottom-1 -right-1 rounded bg-blue-500 px-1 text-[10px] text-white"
							>
								{getFileType(file.type)}
							</span>
						</div>
						<div>
							<p class="font-medium">{file.file_name}</p>
							<p class="text-xs text-alineados-gray-500">Click para descargar o ver</p>
						</div>
					</div>

					<!-- Remove Button -->
					<button
						class="rounded-full p-2 text-alineados-gray-400 transition-colors hover:bg-alineados-gray-100 hover:text-alineados-gray-600"
						aria-label="Remove file"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>
			{/each}
		</div>
	</div>
</div>
