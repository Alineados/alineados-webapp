<script lang="ts">
	import Clock from '$lib/icons/Clock.svelte';
	import { calculateDaysLeft } from '$lib/utils/dates';

	let { targetDate = $bindable(),  extendedText = false, color, textSize = 'xs' } = $props();
</script>

<div class={`flex items-center justify-center gap-1 text-${color}`}>
	<Clock stroke="currentColor" />
	<p class={`text-${textSize} font-medium text-current`}>
		{calculateDaysLeft(targetDate)}
		{extendedText ? 'días restantes' : '¡días!'}
	</p>
</div>
