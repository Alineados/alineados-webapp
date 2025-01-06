<script lang="ts">
	let { description }: { description: string } = $props();

	let checked = $state(false);
</script>

<div class="flex items-center gap-2">
	<span class="text-xs font-medium text-alineados-gray-700">{description}</span>
	<label class="relative inline-flex cursor-pointer items-center">
		<input type="checkbox" bind:checked class="peer sr-only" />
		<div
			class="peer h-6 w-11 rounded-full bg-alineados-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-alineados-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"
		></div>
	</label>
</div>