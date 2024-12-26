<script lang="ts">
	import { onMount } from "svelte";

	let { status = $bindable(), completed = $bindable(), classTw = "px-4 py-[6px] " } = $props();

	let text = $state('');

	onMount(() => {
		if (completed) text = 'Concluida';
		else text = status ? 'Activa' : 'No activa';
	});
</script>

<div class={`inline-flex items-center rounded-full ${classTw} 
	${(status || completed) ? 'bg-alineados-green-100 text-alineados-green-900' : 'bg-red-100 text-red-600'}`}>
	<span class="text-xs font-semibold">
		{#if completed}
			{text}
		{:else}
			{status ? 'Activa' : 'No activa'}
		{/if}

	</span>
</div>
