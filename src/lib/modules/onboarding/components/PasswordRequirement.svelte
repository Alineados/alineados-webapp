<script lang="ts">
	import Check from '$lib/icons/CircleCheckSolid.svelte';
	import Cross from '$lib/icons/Cross.svelte';

	let {
		checked = false,
		text = '',
		textColor = '#7BB026'
	}: {
		text: string;
		checked?: boolean;
		textColor?: string;
	} = $props();
</script>

<div class="flex items-center gap-2">
	{#if checked}
		<Check width={18} height={18} fill={textColor} />
	{:else}
		<Cross width={18} height={18} />
	{/if}
	<p class="text-sm font-semibold" style="color: {checked ? textColor : '#7E7E7E'};">
		{text}
	</p>
</div>
