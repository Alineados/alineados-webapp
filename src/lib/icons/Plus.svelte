<script lang="ts">
	export let width: number = 11;
	export let height: number = 10;
	export let color: string = 'white';
</script>

<svg {width} {height} viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M5.45117 1.875V8.125M8.57617 5H2.32617"
		stroke={color}
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
