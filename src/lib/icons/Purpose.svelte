<script lang="ts">
	let { stroke = '#515151', width = 24, height = 24 } = $props();
</script>

<svg {width} {height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle cx="11.9996" cy="11.9996" r="7.65" {stroke} stroke-width="1.5" />
	<circle cx="12.0002" cy="11.9992" r="4.3" {stroke} />
	<circle cx="12.0002" cy="11.9992" r="4.05" {stroke} stroke-width="1.5" />
	<circle cx="12" cy="12" r="11.25" {stroke} stroke-width="1.5" />
</svg>
