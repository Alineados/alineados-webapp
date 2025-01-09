<script lang="ts">
	import Cross from '$lib/icons/CircleCrossSolid.svelte';
	import type { Snippet } from 'svelte';

	// Props
	let {
		isError = false,
		erroMessage
	}: {
		isError?: boolean;
		erroMessage: Snippet;
	} = $props();

	// States
</script>

<div
	class="absolute -bottom-5 flex items-center gap-1"
	class:text-[#ef4444]={isError}
	class:text-[#7E7E7E]={!isError}
>
	<Cross styleTw="size-3" />
	<p class="text-xs font-semibold">
		{@render erroMessage()}
	</p>
</div>
