<script lang="ts">
	import Eye from '$lib/icons/Eye.svelte';
	import { goto } from '$app/navigation';

	function handleClick() {
		goto('/dashboard/problems/view');
	}
</script>

<button
	class="group flex items-center gap-[6px] rounded-lg bg-[#0F172A] px-5 py-4 text-white transition duration-300 ease-in-out hover:bg-[#1A2642] hover:shadow-lg hover:shadow-[#0F172A]/30"
	aria-label="Ver"
	on:click={handleClick}
>
	<Eye styleTw="size-4" />
	<p class="text-sm font-medium">Ver</p>
</button>
