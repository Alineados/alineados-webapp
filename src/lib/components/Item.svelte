<script lang="ts">
	import Copy from '$lib/icons/Copy.svelte';
	import Done from '$lib/icons/Done.svelte';
	import Order from '$lib/icons/Order.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import Repeat from '$lib/icons/Repeat.svelte';
	import Star from '$lib/icons/Star.svelte';
	import Sun from '$lib/icons/Sun.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';

	let {
		value = $bindable(),
		isAccountability = false,
		isUnique = false,
		isNew = false,
		isStarred = $bindable(),
		isDaily = $bindable(),
		addItem,
		deleteItem,
		prominentItem,
		dailyItem
	}: {
		value?: string;
		isAccountability?: boolean;
		isUnique?: boolean;
		isNew?: boolean;
		isStarred?: boolean;
		isDaily?: boolean;
		addItem?: () => void;
		deleteItem?: () => void;
		prominentItem?: () => void;
		dailyItem?: () => void;
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
		if (event.key === 'Tab') {
			event.preventDefault();
			if (addItem) addItem();
		}
	}

	let isDone = $state(false);
	let isRepeated = $state(false);

	// Handlers

	function handlerDoneItem() {
		isDone = !isDone;
		console.log(isDone);
	}

	function handlerRepeatItem() {
		isRepeated = !isRepeated;
	}
</script>

<div
	class="item-container group flex h-auto items-center justify-between"
	class:pl-8={isUnique || isNew}
>
	{#if !isUnique && !isNew}
		<div class="flex items-center gap-0">
			<button
				onclick={addItem}
				class={`invisible text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600 group-hover:visible`}
				aria-label="Plus"
			>
				<Plus styleTw="size-4" />
			</button>
			<button
				class={`invisible text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600 group-hover:visible`}
				aria-label="Order"
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
			onclick={() => navigator.clipboard.writeText(value!)}
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
		></textarea>
	</div>

	{#if !isNew}
		<div
			class={`invisible ml-2 flex w-auto items-center justify-center gap-1 group-focus-within:visible group-hover:visible`}
		>
			{#if isAccountability}
				<button
					onclick={handlerDoneItem}
					class:text-alineados-gray-400={!isDone}
					class:text-green-500={isDone}
					class="hover:text-green-500"
					aria-label="Check"
				>
					<Done styleTw="size-4" />
				</button>

				<button
					onclick={handlerRepeatItem}
					class:text-alineados-gray-400={!isRepeated}
					class:text-blue-500={isRepeated}
					class=" hover:text-blue-500"
					aria-label="Repeat"
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
					class="hover:text-yellow-500"
					aria-label="Star"
				>
					<Star styleTw="size-4" />
				</button>
				<button
					onclick={() => {
						if (dailyItem) dailyItem();
					}}
					class:text-alineados-gray-400={!isDaily}
					class:text-alineados-green-500={isDaily}
					class=" hover:text-alineados-green-500"
					aria-label="Day"
				>
					<Sun styleTw="size-4" />
				</button>
				<button
					onclick={() => {
						if (deleteItem) deleteItem();
					}}
					class="text-alineados-gray-400 hover:text-red-500"
					aria-label="Delete"
				>
					<TrashCan styleTw="size-4" />
				</button>
			{/if}
		</div>
	{/if}
</div>
