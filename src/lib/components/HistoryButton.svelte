<script lang="ts">
	import Eye from '$lib/icons/Eye.svelte';
</script>

<button
	class="group flex items-center gap-[6px] rounded-lg border border-[#7E7E7E] bg-white px-5 py-3 transition duration-300 ease-in-out hover:bg-[#7E7E7E] hover:text-white hover:shadow-lg hover:shadow-[#7E7E7E]/30"
	aria-label="Historial"
>
	<Eye width={15} height={15} styleTw="text-[#7E7E7E] group-hover:text-white" />
	<p class="text-sm font-medium text-[#7E7E7E] group-hover:text-white">Ver</p>
</button>
