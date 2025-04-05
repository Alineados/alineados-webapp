<script>
	export let fill = '#566994';
	export let stroke = '#566994';
	export let width = 25;
	export let height = 25;
	export let backgroundColor = '#FFFFFF'; // Color de fondo
</script>

<svg {width} {height} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
	<!-- Fondo -->
	<rect x="0" y="0" width="25" height="25" rx="12.5" fill={backgroundColor} />
	<!-- Icono -->
	<rect
		x="0.9966"
		y="1.07473"
		width="22.5185"
		height="22.5185"
		rx="11.2593"
		{stroke}
		stroke-width="1.48148"
	/>
	<!-- <path
		d="M8.71424 14.5325V13.5132L12.6965 7.80065H14.332V13.3592H15.4342V14.5325H14.332V16.334H13.0046V14.5325H8.71424ZM13.0639 9.17547L10.2668 13.3592H13.0639V9.17547Z"
		{fill}
	/> -->
</svg>
