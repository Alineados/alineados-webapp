<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Tooltip from '$lib/shared/ui/tooltip/index';

	let {
		messages,
		message,
		open = $bindable(false),
		children
	}: { messages?: string[]; message?: string; open: boolean; children: Snippet } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={100} bind:open>
		<Tooltip.Trigger>
			{@render children?.()}
		</Tooltip.Trigger>
		<Tooltip.Content class="flex {message ? 'flex-row' : 'flex-col'} gap-1 bg-white">
			{#if message}
				<p class="text-xs text-alineados-blue-900">{message}</p>
			{:else if messages}
				{#each messages as msg,i}
					<p class="text-xs text-alineados-blue-900 {i===0 ? 'font-semibold': ''}">{msg}</p>
				{/each}
			{/if}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
