<script lang="ts">
	let {
		icon,
		title,
		isActive = $bindable(),
		id,
		onSelectedCard
	}: {
		icon: string;
		title: string;
		isActive: boolean;
		id: number;
		onSelectedCard: () => void;
	} = $props();
</script>

<button
	onclick={() => onSelectedCard && onSelectedCard()}
	onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectedCard && onSelectedCard()}
	class="flex flex-col items-center gap-2 transition-all duration-300 ease-in-out {isActive
		? 'scale-90'
		: 'scale-75'}"
	aria-pressed={isActive}
>
	<div
		class="relative flex aspect-square items-center justify-center rounded-full transition-all duration-300 {isActive
			? 'bg-alineados-green-100 text-alineados-green-900'
			: 'bg-alineados-gray-100 text-alineados-gray-800'}"
		style="width: {isActive ? '120px' : '80px'}"
	>
		<div class="text-3xl">
			{icon}
		</div>
	</div>
	{#if isActive}
		<span class="text-lg font-medium text-alineados-green-900 transition-opacity duration-300">
			{title}
		</span>
	{/if}
</button>
