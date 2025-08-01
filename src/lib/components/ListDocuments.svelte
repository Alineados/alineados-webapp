<script lang="ts">
	import File from '$lib/icons/File.svelte';
	import Image from '$lib/icons/Image.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';
	import Upload from '$lib/icons/Upload.svelte';

	import { problemInfo, removeMemory } from '$lib/stores';

	let { disabled = $bindable() }: { disabled: boolean } = $props();

	function getFileIcon(type: string) {
		// Solo mostrar icono de documento, no imágenes
		return 'document';
	}

	function handleDelete(id: string, type: string) {
		removeMemory(id, type);
	}

	// Filtrar solo documentos (no imágenes)
	const documentsOnly = $derived($problemInfo.memories.filter(memory => 
		!memory.type.startsWith('image') && 
		!memory.type.startsWith('carousel_image')
	));
</script>

<div class="mx-auto w-full max-w-2xl pt-5">
	<div class="">
		<div class="flex items-center justify-between border-b py-1">
			<div class="flex items-center gap-2">
				<File class="size-5" />
				<h2 class="text-base font-semibold text-alineados-gray-800">Archivos adjuntos</h2>
			</div>
			<Upload
				type="problems"
				bind:disabledBtn={disabled}
				styles=""
				changeIcon={false}
				acceptable=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
				styleTw="size-5 text-alineados-gray-600 hover:text-alineados-gray-900"
			/>
		</div>

		<div class="divide-y">
			{#each documentsOnly as file, index}
				<div class="flex items-center justify-between py-2 hover:bg-alineados-gray-50">
					<div class="flex items-center gap-3">
						<File class="size-5 text-alineados-orange-900" />

						<span class="text-xs font-medium text-alineados-orange-900">{file.file_name}</span>
					</div>
					<button
						class="text-alineados-gray-400 hover:text-alineados-gray-600"
						onclick={() => handleDelete(file.id, file.type)}
					>
						<TrashCan styleTw="size-4" />
					</button>
				</div>
			{/each}
		</div>
	</div>
</div>
