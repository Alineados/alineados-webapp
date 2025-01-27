<script lang="ts">
	import Clock from '$lib/icons/Clock.svelte';
	import { calculateDaysLeft } from '$lib/utils/dates';

	let { targetDate = $bindable(), extendedText = false, color, textSize = 'xs' } = $props();

	function getDaysText(days: number, isExtended: boolean): string {
		const absoluteDays = Math.abs(days);

		if (isExtended) return 'días restantes';
		if (days < 0) return 'días atrasados';
		if (absoluteDays <= 1) return 'día restante';
		return 'días restantes';
	}
</script>

<div class={`flex items-center justify-between gap-1 text-${color}`}>
	<Clock stroke="currentColor" />
	<p class={`text-${textSize} font-medium text-current`}>
		{Math.abs(calculateDaysLeft(targetDate))}
		{getDaysText(calculateDaysLeft(targetDate), extendedText)}
	</p>
</div>
