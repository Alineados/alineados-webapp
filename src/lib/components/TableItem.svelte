<script lang="ts">
	import Copy from '$lib/icons/Copy.svelte';

	let { value } = $props();

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(value);
			// Optional: Add toast/notification that text was copied
		} catch (err) {
			console.error('Failed to copy text:', err);
		}
	}
</script>

<div class="group flex items-start gap-2">
	<button
		class="text-alineados-gray-300 hover:text-alineados-gray-600"
		onclick={copyToClipboard}
		aria-label="Copy text"
	>
		<Copy styleTw="size-5" />
	</button>
	<p class="text-sm font-medium text-alineados-gray-600 group-hover:underline">{value}</p>
</div>
