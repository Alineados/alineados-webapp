<script lang="ts">
	import { onMount } from "svelte";

	let { status = $bindable(), completed = $bindable(), classTw = "px-4 py-[6px] " } = $props();


	function setBg() {
		if (completed) 
			return 'bg-blue-100 text-blue-900';
		else if (status) 
			return 'bg-alineados-green-100 text-alineados-green-900';
		else 
			return 'bg-alineados-gray-100 text-alineados-gray-600';
	}

	function setText() {
		let text = '';
		if (completed) text = 'Concluida';
		else text = status ? 'Activa' : 'No activa';
		return text;
	}

	
</script>

<div class={`inline-flex items-center rounded-full ${classTw} 
	${setBg()}`}>
	<span class="text-xs font-semibold">
		{#if completed}
			{setText()}
		{:else}
			{status ? 'Activa' : 'No activa'}
		{/if}

	</span>
</div>
