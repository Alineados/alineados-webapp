<script lang="ts">
	export let width: number = 14;
	export let height: number = 15;
	export let fill: string = 'none';
	export let stroke: string = '#9E9E9E';
	export let strokeWidth: number = 1.5;
</script>

<svg {width} {height} viewBox="0 0 14 15" {fill} xmlns="http://www.w3.org/2000/svg">
	<path
		d="M2.625 7.83789L6.125 11.3379L11.375 3.46289"
		{stroke}
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
