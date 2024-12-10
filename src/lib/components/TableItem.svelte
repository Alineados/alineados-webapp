<script lang="ts">
	import Copy from '$lib/icons/Copy.svelte';

	let { value } = $props();
</script>

<div class="group flex gap-2">
	<button class="text-alineados-gray-300 hover:text-alineados-gray-600">
		<Copy styleTw="size-6" />
	</button>
	<p class="text-sm font-medium text-alineados-gray-600 group-hover:underline">{value}</p>
</div>
