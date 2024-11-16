<script lang="ts">
	import Eye from '$lib/icons/Eye.svelte';
</script>

<button
	class="group flex items-center gap-[6px] rounded-lg border border-[#7E7E7E] bg-white px-6 py-4 transition duration-300 ease-in-out hover:bg-[#7E7E7E] hover:text-white hover:shadow-lg hover:shadow-[#7E7E7E]/30"
	aria-label="Historial"
>
	<Eye width={20} height={20} styleTw="text-[#7E7E7E] group-hover:text-white" />
	<p class="text-base font-medium text-[#7E7E7E] group-hover:text-white">Historial</p>
</button>
