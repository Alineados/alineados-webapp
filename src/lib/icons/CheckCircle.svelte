<script lang="ts">
	export let width: number = 24;
	export let height: number = 24;
	export let color: string = 'currentColor';
</script>

<svg
	{width}
	{height}
	viewBox="0 0 24 24"
	fill="none"
	stroke-width="1.5"
	stroke={color}
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
	/>
</svg>
