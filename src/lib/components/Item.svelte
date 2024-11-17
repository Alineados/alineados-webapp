<script lang="ts">
	import Copy from '$lib/icons/Copy.svelte';
	import Done from '$lib/icons/Done.svelte';
	import Order from '$lib/icons/Order.svelte';
	import Repeat from '$lib/icons/Repeat.svelte';
	import Star from '$lib/icons/Star.svelte';
	import TrashCan from '$lib/icons/TrashCan.svelte';

	let title =
		'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non.';
</script>

<div class="item-container flex w-[400px] items-center justify-between px-4 py-2">
	<div class="flex items-center gap-4">
		<!-- Menu button -->
		<button class="rounded-lg p-2" aria-label="Menu">
			<Order />
		</button>

		<!-- Document icon and title -->
		<div class="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-gray-100">
			<Copy />
			<input
				class="max-w-2xl truncate border-none bg-transparent font-medium text-gray-700 focus:outline-none"
				type="text"
				bind:value={title}
			/>
		</div>
	</div>

	<!-- Action buttons -->
	<div class="flex items-center gap-2">
		<!-- Delete -->
		<button class="rounded-lg p-2 hover:bg-gray-100" aria-label="Delete">
			<TrashCan />
		</button>

		<!-- Star -->
		<button class="rounded-lg p-2 hover:bg-gray-100" aria-label="Star">
			<Star />
		</button>

		<!-- Check -->
		<button class="rounded-lg p-2 hover:bg-gray-100" aria-label="Check">
			<Done />
		</button>

		<!-- Refresh -->
		<button class="rounded-lg p-2 hover:bg-gray-100" aria-label="Refresh">
			<Repeat />
		</button>
	</div>
</div>

<style>
	.item-container:hover .icon {
		fill: #0fc917; /* Cambia este color según tus necesidades */
	}
</style>
