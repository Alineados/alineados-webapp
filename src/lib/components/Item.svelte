<script lang="ts">
	import Copy from '$lib/icons/Copy.svelte';
	import Done from '$lib/icons/Done.svelte';
	import Order from '$lib/icons/Order.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import Repeat from '$lib/icons/Repeat.svelte';
	import Star from '$lib/icons/Star.svelte';
	import Sun from '$lib/icons/Sun.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';
	import { toast } from 'svelte-sonner';

	let {
		value = $bindable(),
		isOnlyText = $bindable(),
		isStarred = $bindable(),
		isDaily = $bindable(),
		isDone = $bindable(),
		isRepeated = $bindable(),
		isAccountability = false,
		isUnique = false,
		isNew = false,
		isDisabled = false,
		addItem,
		deleteItem,
		prominentItem,
		dailyItem,
		doneItem,
		repeatItem
	}: {
		value?: string;
		isAccountability?: boolean;
		isUnique?: boolean;
		isNew?: boolean;
		isOnlyText?: boolean;
		isDisabled?: boolean;
		isStarred?: boolean;
		isDaily?: boolean;
		isDone?: boolean;
		isRepeated?: boolean;
		addItem?: () => void;
		deleteItem?: () => void;
		prominentItem?: () => void;
		dailyItem?: () => void;
		doneItem?: () => void;
		repeatItem?: () => void;
	} = $props();

	function autoResize(event: Event) {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}

	function handleTextareaClick() {
		isNew = false;
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (!isOnlyText) return;

		if (event.key === 'Tab') {
			event.preventDefault();
			if (addItem) addItem();
		}
	}

	function copyClipboard() {
		navigator.clipboard.writeText(value!);

		// Show toast
		toast.success('Copiado al portapapeles', {
			duration: 1000
		});
	}
</script>

<div
	class="item-container group flex h-auto items-center justify-between"
	class:pl-8={isUnique || isNew || !isOnlyText}
>
	{#if !isUnique && !isNew && isOnlyText}
		<div class="flex items-center gap-0">
			<button
				onclick={isDisabled ? null : addItem}
				class={`invisible text-alineados-gray-300 group-hover:visible ${isDisabled ? '' : 'hover:text-alineados-gray-600 focus:text-alineados-gray-600'}`}
				aria-label="Plus"
				disabled={isDisabled || isAccountability}
				class:opacity-0={isAccountability}
			>
				<Plus styleTw="size-4" />
			</button>
	
			<button
				class={`invisible text-alineados-gray-300 group-hover:visible ${isDisabled ? '' : 'hover:text-alineados-gray-600 focus:text-alineados-gray-600'}`}
				aria-label="Order"
				disabled={isDisabled}
			>
				<Order stroke="currentColor" />
			</button>
		</div>
	{/if}

	<div
		class="ml-1 flex w-full items-center gap-3 rounded-lg p-1 focus-within:bg-gray-100 hover:bg-gray-100"
	>
		<button
			aria-label="Copy"
			onclick={copyClipboard}
			class="text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600"
		>
			<Copy styleTw="size-5" />
		</button>

		<textarea
			class="flex-grow resize-none overflow-hidden border-none bg-transparent text-sm font-medium text-gray-600 focus:underline focus:outline-none group-hover:underline"
			bind:value
			placeholder="Agregar nuevo item"
			oninput={autoResize}
			onclick={handleTextareaClick}
			onkeydown={handleKeyPress}
			rows="1"
			spellcheck="false"
			readonly={!isOnlyText || isDisabled}
		></textarea>
	</div>

	{#if !isNew && isOnlyText}
		<div
			class={`invisible ml-2 flex w-auto items-center justify-center gap-1 group-focus-within:visible group-hover:visible`}
		>
			{#if isAccountability}
				<button
					onclick={() => {
						if (doneItem) doneItem();
					}}
					class:text-alineados-gray-400={!isDone}
					class:text-green-500={isDone}
					class:hover:text-green-500={!isDisabled}
					aria-label="Check"
					disabled={isDisabled}
				>
					<Done styleTw="size-4" />
				</button>

				<button
					onclick={() => {
						if (repeatItem) repeatItem();
					}}
					class:text-alineados-gray-400={!isRepeated}
					class:text-blue-500={isRepeated}
					class:hover:text-blue-500={!isDisabled}
					aria-label="Repeat"
					disabled={isDisabled}
				>
					<Repeat styleTw="size-4" />
				</button>
			{:else}
				<button
					onclick={() => {
						if (prominentItem) prominentItem();
					}}
					class:text-alineados-gray-400={!isStarred}
					class:text-yellow-500={isStarred}
					class:hover:text-yellow-500={!isDisabled}
					aria-label="Star"
					disabled={isDisabled}
				>
					<Star styleTw="size-4" />
				</button>
				<button
					onclick={() => {
						if (dailyItem) dailyItem();
					}}
					class:text-alineados-gray-400={!isDaily}
					class:text-alineados-green-500={isDaily}
					class:hover:text-alineados-green-500={!isDisabled}
					aria-label="Day"
					disabled={isDisabled}
				>
					<Sun styleTw="size-4" />
				</button>
				<button
					onclick={() => {
						if (deleteItem) deleteItem();
					}}
					class="text-alineados-gray-400"
					class:hover:text-red-500={!isDisabled}
					aria-label="Delete"
					disabled={isDisabled}
				>
					<TrashCan styleTw="size-4" />
				</button>
			{/if}
		</div>
	{/if}
</div>
