<script lang="ts">
	import Clock from '$lib/icons/Clock.svelte';
	import { calculateDaysLeft } from '$lib/utils/dates';

	let { targetDate = $bindable(), extendedText = false, color, textSize = 'xs' } = $props();
</script>

<div class={`flex items-center justify-center gap-1 text-${color}`}>
	<Clock stroke="currentColor" />
	<p class={`text-${textSize} font-medium text-current`}>
		{calculateDaysLeft(targetDate) < 0 ? Math.abs(calculateDaysLeft(targetDate)) : calculateDaysLeft(targetDate)}  
		{extendedText
			? 'días restantes'
			: calculateDaysLeft(targetDate) < 0
				? 'días atrasados'
				: calculateDaysLeft(targetDate) <= 1
					? 'día restante'
					: 'días restantes'}
	</p>
</div>
