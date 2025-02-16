<script lang="ts">
	import Play from '$lib/icons/Play.svelte';
	import Stop from '$lib/icons/Stop.svelte';
	import Upload from '$lib/icons/Upload.svelte';
	import { storyState } from '$lib/stores';

	let {
		title = $bindable(''),
		content = $bindable(''),
		storyType = ''
	}: {
		title?: string;
		content?: string;
		storyType?: string;
	} = $props();

	let isPlaying = $state(false);
</script>

<div class="w-full py-4">
	<!-- Info -->
	<div class="mb-3 flex items-center justify-end">
		<!-- <button
			class="rounded-xl bg-alineados-green-900 px-6 py-2 text-white transition-colors hover:bg-alineados-green-800"
		>
			Grabar
		</button> -->

		<div class="flex flex-row gap-4">
			<span
				class="bg- self-center rounded-2xl bg-alineados-blue-50 px-4 py-2 text-sm font-medium text-alineados-gray-900"
			>
				{title || 'Subir archivo'}
			</span>
			<Upload
				{storyType}
				acceptable="audio/*"
				disabledBtn={true}
				styles=""
				changeIcon={false}
				styleTw="size-6 text-alineados-alineados-gray-600 hover:text-alineados-alineados-gray-900"
			/>
		</div>
	</div>
	<!-- Transcription -->

	<div class="rounded-lg border border-alineados-gray-200 bg-white p-6 shadow-sm">
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
			{content}
		</p>
	</div>
</div>
