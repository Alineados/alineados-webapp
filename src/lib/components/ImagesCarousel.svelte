<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const images = [
		'https://robohash.org/asdasd',
		'https://robohash.org/asdaasd',
		'https://robohash.org/asdaaasd'
	];

	let currentIndex = writable(0);

	function selectImage(index: number) {
		currentIndex.set(index);
	}

	let interval;

	onMount(() => {
		interval = setInterval(() => {
			currentIndex.update((n) => (n + 1) % images.length);
		}, 3000);

		return () => clearInterval(interval);
	});
</script>

<div class="relative h-60 w-full overflow-hidden rounded-lg bg-[#E3E5E7]">
	{#each images as image, index}
		<img
			src={image}
			alt="Imagen de muestra"
			class="absolute inset-0 h-full w-full rounded-lg object-cover p-1 transition-opacity duration-500"
			style="opacity: {index === $currentIndex ? 1 : 0}"
		/>
	{/each}

	<div class="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform space-x-2">
		{#each images as _, index}
			<button
				class="h-2 w-2 rounded-full bg-white transition-opacity duration-300"
				class:bg-opacity-50={index !== $currentIndex}
				on:click={() => selectImage(index)}
			></button>
		{/each}
	</div>
</div>
