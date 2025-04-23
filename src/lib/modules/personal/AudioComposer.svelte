<script lang="ts">
	import Play from '$lib/icons/Play.svelte';
	import Stop from '$lib/icons/Stop.svelte';
	import Upload from '$lib/icons/Upload.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';
	import { storyState } from '$lib/stores';

	let {
		title = $bindable(''),
		content = $bindable(''),
		storyType = '',
		type = '',
		animate = false
	} = $props();

	const hasContent = $derived(Boolean(content?.trim()));
	let isPlaying = $state(false);
	let isUploading = $state(false);

	function handleDelete() {
		title = '';
		content = '';
	}
</script>

<div class="w-full py-4">
	<!-- Info -->
	<div class="mb-3 flex items-center justify-end gap-4">
		<div class="flex flex-row gap-4">
			<span class="self-center rounded-2xl bg-alineados-blue-50 px-4 py-2 text-sm font-medium text-alineados-gray-900">
				{title || 'Subir archivo'}
			</span>
			{#if content}
				<button 
					class="rounded-lg p-2 transition-colors hover:bg-alineados-gray-100"
					on:click={handleDelete}
				>
					<TrashCan styleTw="size-6 text-alineados-red-600" />
				</button>
			{/if}
			<Upload
				{type}
				{storyType}
				acceptable="audio/*"
				disabledBtn={true}
				styles=""
				changeIcon={false}
				bind:isLoading={isUploading}
				styleTw="size-6 text-alineados-alineados-gray-600 hover:text-alineados-alineados-gray-900"
			/>
		</div>
	</div>
	<!-- Transcription -->

	<div class="rounded-lg border-2 bg-white p-6 shadow-sm {animate && !hasContent ? 'animate-border-cursor-blink border-transparent' : 'border-alineados-gray-200'}">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-2xl font-bold text-alineados-gray-800">Transcripción</h2>
			{#if content}
				<button class="rounded-lg p-2 transition-colors hover:bg-alineados-gray-100">
					{#if isPlaying}
						<Stop styleTw="size-6" />
					{:else}
						<Play styleTw="size-6" />
					{/if}
				</button>
			{/if}
		</div>

		<p class="text-base font-normal leading-relaxed text-alineados-gray-800">
			{#if content !== undefined && content !== null && content.trim() !== ''}
				{content}
			{:else if isUploading}
				<span class="text-alineados-gray-600">Procesando transcripción...</span>
			{:else}
				<span class="text-alineados-gray-400">La transcripción aparecerá aquí cuando subas un audio</span>
			{/if}
		</p>
	</div>
</div>
