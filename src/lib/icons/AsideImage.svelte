<script lang="ts">
	let { size = $bindable(1) } = $props<{ size?: number }>();

	// Base dimensions
	const baseWidth = 350;
	const baseHeight = 288;

	// Calculated dimensions
	let width = $derived(baseWidth * size);
	let height = $derived(baseHeight * size);
</script>

<svg {width} {height} viewBox="0 0 350 288" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M1 118.5C34.1667 139.333 104.9 187.5 122.5 213.5C163.333 161 265.8 45 349 1C286.833 59.1667 154.5 197.7 122.5 286.5C89.8333 238 19.8 136.5 1 118.5Z"
		fill="#65A772"
		stroke="#65A772"
	/>
</svg>
