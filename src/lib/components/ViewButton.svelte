<script lang="ts">
	import { goto } from '$app/navigation';
	import Document from '$lib/icons/Document.svelte';
	import DocumentText from '$lib/icons/DocumentText.svelte';
	import Eye from '$lib/icons/Eye.svelte';
</script>

<button
	class="group flex items-center gap-[6px] rounded-lg bg-alineados-gray-100 px-5 py-4 text-alineados-blue-900 transition duration-300 ease-in-out hover:bg-alineados-blue-800 hover:shadow-lg hover:shadow-alineados-blue-900/30"
	aria-label="Ver"
	onclick={() => {
		goto('/personal/problems/view');
	}}
>
	<!-- <Eye styleTw="size-4" /> -->
	<DocumentText styleTw="size-4" />

	<p class="text-sm font-medium">Resumen</p>
</button>
