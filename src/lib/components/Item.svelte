<script lang="ts">
	import Copy from '$lib/icons/Copy.svelte';
	import Done from '$lib/icons/Done.svelte';
	import Order from '$lib/icons/Order.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import Repeat from '$lib/icons/Repeat.svelte';
	import Star from '$lib/icons/Star.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';

	let {
		value,
		isAccountability = false,
		isDisabled = false
	}: {
		value?: typeof $bindable;
		isAccountability?: boolean;
		isDisabled?: boolean;
	} = $props();

	function autoResize(event: Event) {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}

	function handleTextareaClick() {
		isDisabled = false;
	}
</script>

<div class="item-container group flex h-auto items-center justify-between">
	<div class="flex items-center gap-1">
		<button
			class={`invisible text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600 ${isDisabled ? '' : 'group-focus-within:visible group-hover:visible'}`}
			aria-label="Menu"
		>
			<Plus width={14} height={14} color="currentColor" />
		</button>
		<button
			class={`text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600 ${isDisabled ? 'invisible' : 'visible'}`}
			aria-label="Menu"
		>
			<Order stroke="currentColor" />
		</button>
	</div>

	<div
		class="ml-1 flex w-full items-center gap-4 rounded-lg p-1 focus-within:bg-gray-100 hover:bg-gray-100"
	>
		<button
			class="text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600"
		>
			<Copy fill="currentColor" />
		</button>

		<textarea
			class={`flex-grow resize-none overflow-hidden border-none bg-transparent text-xs font-medium text-gray-600 focus:outline-none ${isDisabled ? '' : 'underline'}`}
			bind:value
			placeholder="Agrear nuevo item"
			oninput={autoResize}
			onclick={handleTextareaClick}
			rows="1"
		></textarea>
	</div>

	<div
		class={`invisible ml-2 flex w-auto items-center gap-1 ${isDisabled ? '' : 'group-focus-within:visible group-hover:visible'}`}
	>
		<button
			class="text-alineados-gray-400 hover:text-red-500 focus:text-red-500"
			aria-label="Delete"
		>
			<TrashCan stroke="currentColor" />
		</button>

		<button
			class="text-alineados-gray-400 hover:text-yellow-500 focus:text-yellow-500"
			aria-label="Star"
		>
			<Star stroke="currentColor" />
		</button>

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
		{/if}
	</div>
</div>
