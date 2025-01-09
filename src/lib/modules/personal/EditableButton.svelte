<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		title,
		isActive = $bindable(),
		onClick
	}: { children: Snippet; title: string; isActive: boolean; onClick: () => void } = $props();
</script>

<button
	onclick={onClick}
	class="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-2xl border border-alineados-gray-100 bg-alineados-gray-50"
	class:border-alineados-green-900={isActive}
	class:bg-alineados-green-50={isActive}
>
	<!-- <Text styleTw="size-6 text-black" /> -->
	{@render children?.()}
	<p
		class="text-xs font-semibold text-alineados-gray-900"
		class:text-alineados-green-900={isActive}
	>
		{title}
	</p>
</button>
