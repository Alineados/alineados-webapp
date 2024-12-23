<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Tooltip from '$lib/shared/ui/tooltip/index';

	let { message, children }: { message: string; children: Snippet } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={100}>
		<Tooltip.Trigger>
			{@render children?.()}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p class="text-xs text-alineados-blue-900">{message}</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
