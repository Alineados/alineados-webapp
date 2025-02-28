<script lang="ts">
	import Copy from '$lib/icons/Copy.svelte';
	import Star from '$lib/icons/Star.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';
	import { toast } from 'svelte-sonner';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { goto } from '$app/navigation';
	import type { Thought } from '$lib/interfaces';
	import DocumentCard from '../DocumentCard.svelte';

	let {
		thought = $bindable(),
		w_size = '',
		deleteItem,
		prominentItem
	}: {
		thought?: Thought;
		w_size?: string;
		deleteItem?: () => void;
		prominentItem?: () => void;
	} = $props();

	function copyClipboard() {
		// Copy the text content without HTML tags
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = thought?.quality_time.text || '';
		navigator.clipboard.writeText(tempDiv.textContent || '');

		toast.success('Copiado al portapapeles', {
			duration: 1000
		});
	}

	function handleClickThought(e: MouseEvent) {
		e.preventDefault();
		goto(`./thoughts/edit/${thought?.id}`);
	}

	function handleDeleteClick(e: MouseEvent) {
		e.stopPropagation();
		if (deleteItem) {
			deleteItem();
		}
	}

	function handleProminentClick(e: MouseEvent) {
		e.stopPropagation();
		if (prominentItem) {
			prominentItem();
		}
	}
</script>

<div class={`item-container group flex h-auto items-center ${w_size} justify-between`}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="button"
		tabindex="0"
		class="ml-1 flex w-full cursor-pointer items-center gap-1 rounded-lg p-4 hover:bg-alineados-gray-50"
		onclick={handleClickThought}
	>
		{#if !thought?.quality_time.documents?.length}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600"
				onclick={(e) => {
					e.stopPropagation();
					copyClipboard();
				}}
			>
				<Copy styleTw="size-5" />
			</div>
		{/if}

		<!-- Text -->
		{#if thought?.quality_time.text}
			<div class="flex-grow text-sm font-medium text-alineados-gray-600 group-hover:underline">
				{@html thought.quality_time.text}
			</div>
		{/if}

		<!-- Transcription -->
		{#if thought?.quality_time.audio}
			<div class="flex-grow text-sm font-medium text-alineados-gray-600 group-hover:underline">
				{@html thought?.quality_time.audio.content}
			</div>
		{/if}

		<!-- List documents -->
		{#if thought?.quality_time.documents}
			<div class="flex-grow text-sm font-medium text-alineados-gray-600 group-hover:underline">
				<div class="space-y-3">
					{#each thought?.quality_time.documents as file}
						<DocumentCard {file} showDelete={false} />
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="ml-2 flex w-auto items-center justify-center gap-1">
		<Tooltip open={false} message="Destacar">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				onclick={handleProminentClick}
				class={`cursor-pointer transition-colors duration-200 hover:text-yellow-500 ${
					!thought?.is_important ? 'invisible group-hover:visible' : ''
				}`}
				class:text-alineados-gray-400={!thought?.is_important}
				class:text-yellow-500={thought?.is_important}
			>
				<Star styleTw="size-4" />
			</div>
		</Tooltip>
		<Tooltip open={false} message="Borrar">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				onclick={handleDeleteClick}
				class="invisible cursor-pointer text-alineados-gray-400 transition-colors duration-200 hover:text-red-500 group-hover:visible"
			>
				<TrashCan styleTw="size-4" />
			</div>
		</Tooltip>
	</div>
</div>
