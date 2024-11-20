<script>
	let progress = $state(75);
	let text = $state('Loading...');
	let strokeDasharray = $state(0);

	// Circle properties
	const size = 120;
	const strokeWidth = 8;
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;

	$effect(() => {
		strokeDasharray = (progress / 100) * circumference;
	});
</script>

<div class="flex flex-col items-center">
	<svg class="w-30 h-30 -rotate-90 transform" viewBox="0 0 {size} {size}">
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
	<span class="absolute text-2xl font-semibold">{progress}%</span>
	<span class="mt-2 text-sm font-medium text-gray-500">{text}</span>
</div>
