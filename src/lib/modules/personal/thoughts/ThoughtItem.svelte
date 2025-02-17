<script lang="ts">
	import Copy from '$lib/icons/Copy.svelte';
	import Star from '$lib/icons/Star.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';
	import { toast } from 'svelte-sonner';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { goto } from '$app/navigation';
	import type { Thought } from '$lib/interfaces';

	let {
		thought = $bindable(),
		isOnlyText = $bindable(),
		isStarred = $bindable(),
		w_size = '',
		onFocus,
		onInput,
		deleteItem,
		prominentItem
	}: {
		thought?: Thought;
		isOnlyText?: boolean;
		isStarred?: boolean;
		w_size?: string;
		onFocus?: () => void;
		onInput?: () => void;
		deleteItem?: () => void;
		prominentItem?: () => void;
	} = $props();

	function autoResize(event: Event) {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;

		if (onInput) onInput();
	}

	function copyClipboard() {
		navigator.clipboard.writeText(thought?.thought_name!);

		// Show toast
		toast.success('Copiado al portapapeles', {
			duration: 1000
		});
	}

	function handleOnFocus(event: FocusEvent) {
		if (onFocus) onFocus();
	}

	function handleClickThought(e: MouseEvent) {
		e.preventDefault();
		goto(`./thoughts/edit/${thought?.id}`);
	}
</script>

<div class={`item-container group flex h-auto items-center ${w_size} justify-between`}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="button"
		tabindex="0"
		class="ml-1 flex w-full cursor-pointer items-center gap-3 rounded-lg p-1 hover:bg-alineados-gray-50"
		onclick={handleClickThought}
	>
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

		<p class="flex-grow text-sm font-medium text-alineados-gray-600 group-hover:underline">
			{thought?.thought_name}
		</p>
	</div>

	<div
		class="invisible ml-2 flex w-auto items-center justify-center gap-1 group-focus-within:visible group-hover:visible"
	>
		<Tooltip open={false} message="Destacar">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				onclick={(e) => {
					e.stopPropagation();
					if (prominentItem) prominentItem();
				}}
				class="cursor-pointer hover:text-yellow-500"
				class:text-alineados-gray-400={!isStarred}
				class:text-yellow-500={isStarred}
			>
				<Star styleTw="size-4" />
			</div>
		</Tooltip>
		<Tooltip open={false} message="Borrar">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				onclick={(e) => {
					e.stopPropagation();
					if (deleteItem) deleteItem();
				}}
				class="cursor-pointer text-alineados-gray-400 hover:text-red-500"
			>
				<TrashCan styleTw="size-4" />
			</div>
		</Tooltip>
	</div>
</div>
