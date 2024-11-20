<script>
	export let size = 100;
	export let strokeWidth = 10;
	export let progress = 50;
	export let text = 'Progress';

	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDasharray = (circumference * progress) / 100;
</script>

<div class="progress-circle-container">
	<svg class="progress-circle" viewBox="0 0 {size} {size}" width={size} height={size}>
		<circle
			class="text-gray-300"
			stroke-width={strokeWidth}
			stroke="currentColor"
			fill="transparent"
			r={radius}
			cx={size / 2}
			cy={size / 2}
		/>
		<circle
			class="text-blue-600"
			stroke-width={strokeWidth}
			stroke-dasharray="{strokeDasharray} {circumference}"
			stroke-linecap="round"
			stroke="currentColor"
			fill="transparent"
			r={radius}
			cx={size / 2}
			cy={size / 2}
		/>
	</svg>
	<div class="progress-text">
		<span class="text-2xl font-semibold">{progress}%</span>
		<span class="mt-2 block text-sm font-medium text-gray-500">{text}</span>
	</div>
</div>

<style>
	.progress-circle-container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.progress-circle {
		transform: rotate(-90deg);
	}

	.progress-text {
		position: absolute;
		text-align: center;
	}
</style>
