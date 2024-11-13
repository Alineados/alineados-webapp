<script lang="ts">
	import Check from '$lib/icons/Checkk.svelte';
	import Cross from '$lib/icons/Cross.svelte';

	export let icon: 'check' | 'cross';
	export let text: string;
	export let textColor: string = '#7BB026';
	export let highlight: string = '';
	export let highlightColor: string = '#D90D0D';
</script>

<div class="flex items-center gap-2">
	{#if icon === 'check'}
		<Check width={18} height={18} fill={textColor} />
	{:else if icon === 'cross'}
		<Cross width={18} height={18} />
	{/if}
	<p class="text-sm font-semibold" style="color: {icon === 'check' ? textColor : '#7E7E7E'};">
		{text}
		{#if highlight !== ''}
			<span style="color: {highlightColor};">{highlight}</span>
		{/if}
	</p>
</div>
