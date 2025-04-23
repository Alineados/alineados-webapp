<script>
	export let fill = '#566994';
	export let stroke = '#566994';
	export let width = 24;
	export let height = 24;
	export let backgroundColor = '#FFFFFF'; // Color de fondo
</script>

<svg {width} {height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<!-- Fondo -->
	<rect x="0" y="0" width="24" height="24" rx="12" fill={backgroundColor} />
	<!-- Icono -->
	<rect
		x="0.740741"
		y="0.740741"
		width="22.5185"
		height="22.5185"
		rx="11.2593"
		{stroke}
		stroke-width="1.48148"
	/>
	<!-- <path d="M10.7116 8.59259V7.36H13.1768V16H11.8138V8.59259H10.7116Z" {fill} /> -->
</svg>
