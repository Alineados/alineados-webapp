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
		isAccountability = false
	}: {
		value?: typeof $bindable;
		isAccountability?: boolean;
	} = $props();
</script>

<div class="item-container group flex h-5 items-center justify-between px-4 py-2">
	<div class="flex gap-1">
		<button class="invisible text-alineados-gray-300 group-hover:visible" aria-label="Menu">
			<Plus width={14} height={14} color="currentColor" />
		</button>
		<button aria-label="Menu">
			<Order />
		</button>
	</div>

	<div class="ml-1 flex w-full items-center gap-4 rounded-lg hover:bg-gray-100">
		<div class="flex w-full items-center gap-2 rounded-lg px-1 py-1">
			<button>
				<Copy />
			</button>

			<input
				class="flex-grow truncate border-none bg-transparent font-medium text-gray-700 focus:outline-none"
				type="text"
				bind:value
				placeholder="Untitled item"
			/>
		</div>
	</div>

	<div class="ml-2 flex w-auto items-center gap-2">
		<!-- Delete -->
		<button class="text-alineados-gray-400 hover:text-red-500" aria-label="Delete">
			<TrashCan stroke="currentColor" />
		</button>

		<!-- Star -->
		<button class="text-alineados-gray-400 hover:text-yellow-500" aria-label="Star">
			<Star fill="currentColor" />
		</button>

		{#if isAccountability}
			<!-- Check -->
			<button class="text-alineados-gray-400 hover:text-green-500" aria-label="Check">
				<Done stroke="currentColor" />
			</button>

			<!-- Refresh -->
			<button class="text-alineados-gray-400 hover:text-blue-500" aria-label="Refresh">
				<Repeat stroke="currentColor" />
			</button>
		{/if}
	</div>
</div>
