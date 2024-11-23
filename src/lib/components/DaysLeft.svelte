<script lang="ts">
	import Clock from '$lib/icons/Clock.svelte';

	let { targetDate, extendedText = false, color, textSize = 'xs' } = $props();

	function calculateDaysLeft(targetDate: string): number {
		const currentDate = new Date();
		const target = new Date(targetDate);
		const timeDiff = target.getTime() - currentDate.getTime();
		const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
		return daysLeft;
	}

	const daysLeft = calculateDaysLeft(targetDate);
</script>

<div class={`flex items-center justify-center gap-1 text-${color}`}>
	<Clock stroke="currentColor" />
	<p class={`text-${textSize} font-medium text-current`}>
		{daysLeft}
		{extendedText ? 'días restantes' : 'días'}
	</p>
</div>
