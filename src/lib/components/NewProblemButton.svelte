<script lang="ts">
	import Plus from '$lib/icons/Plus.svelte';
</script>

<button
	class="group flex items-center gap-[6px] rounded-lg bg-[#0F172A] px-5 py-[10px] text-white transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:bg-[#1A2642] hover:shadow-lg hover:shadow-[#0F172A]/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#0F172A]"
	aria-label="Crear nuevo problema"
>
	<Plus width={13} height={13} />
	<p class="text-xs font-medium">Nuevo Problema</p>
</button>
