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
		isDisabled = false,
		usePlus = false,
		useOrder = false,
		isProminent = $bindable(),
		addItem,
		deleteItem,
		prominentItem
	}: {
		value: string;
		isAccountability?: boolean;
		isDisabled?: boolean;
		usePlus?: boolean;
		useOrder?: boolean;
		isProminent?: boolean;
		addItem?: () => void;
		deleteItem?: () => void;
		prominentItem?: () => void;
	} = $props();

	function autoResize(event: Event) {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}

	function handleTextareaClick() {
		isDisabled = false;
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
			if (addItem) addItem();
		}
	}
</script>

<div
	class="item-container group flex h-auto items-center justify-between {!usePlus && !useOrder
		? 'pl-10'
		: ''}"
>
	<!-- ${isDisabled ? '' : 'group-focus-within:visible group-hover:visible'} -->
	{#if usePlus && useOrder}
		<div class="flex items-center gap-1">
			<button
				onclick={addItem}
				class={`invisible text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600`}
				aria-label="Menu"
			>
				<Plus styleTw="size-5" />
			</button>
			<!-- ${isDisabled ? 'invisible' : 'visible'} -->
			<button
				class={`text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600 `}
				aria-label="Menu"
			>
				<Order stroke="currentColor" />
			</button>
		</div>
	{/if}

	<div
		class="ml-1 flex w-full items-center gap-3 rounded-lg p-1 focus-within:bg-gray-100 hover:bg-gray-100"
	>
		<button
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

	<!-- invisible ${isDisabled ? '' : 'group-focus-within:visible group-hover:visible'} -->
	<div
		class={`invisible ml-2 flex w-auto items-center justify-center gap-1 group-focus-within:visible group-hover:visible`}
	>
		{#if isAccountability}
			<button
				class="text-alineados-gray-400 hover:text-green-500 focus:text-green-500"
				aria-label="Check"
			>
				<Done stroke="currentColor" />
			</button>

			<button
				class="text-alineados-gray-400 hover:text-blue-500 focus:text-blue-500"
				aria-label="Refresh"
			>
				<Repeat stroke="currentColor" />
			</button>
		{:else}
			<button
				onclick={prominentItem}
				class="{isProminent
					? 'text-yellow-500'
					: 'text-alineados-gray-400'} hover:text-yellow-500 focus:text-yellow-500"
				aria-label="Star"
			>
				<Star stroke="currentColor" />
			</button>
			<button
				class="text-alineados-gray-400 hover:text-alineados-green-500 focus:text-alineados-green-500"
				aria-label="Day"
			>
				<Sun stroke="currentColor" />
			</button>
			<button
				onclick={deleteItem}
				class="text-alineados-gray-400 hover:text-red-500 focus:text-red-500"
				aria-label="Delete"
			>
				<TrashCan stroke="currentColor" />
			</button>
		{/if}
	</div>
</div>
