<script lang="ts">
	import { onMount } from 'svelte';
	import { problemsImages } from '$lib/stores';
	import alineadosImage from '$lib/assets/alineados-check.jpeg';

	let currentIndex = $state(0);

	function selectImage(index: number) {
		currentIndex = index;
	}

	let interval: number;

	onMount(() => {
		if ($problemsImages.length === 0) return;
		interval = setInterval(() => {
			const nextIndex = (currentIndex + 1) % $problemsImages.length;
			currentIndex = nextIndex;
		}, 3000);

		return () => clearInterval(interval);
	});
</script>

<div class="relative z-10 h-60 w-full overflow-hidden rounded-lg bg-alineados-gray-50">
	{#if $problemsImages.length === 0}
		<img
			src={alineadosImage}
			alt="alieneados check"
			class="absolute inset-0 h-full w-full rounded-lg object-cover p-1 transition-opacity duration-500"
			style="opacity: {0 === currentIndex ? 1 : 0}"
		/>
	{:else}
		{#each $problemsImages as image, index}
			<img
				src={image.url}
				alt={`Image ${index + 1}`}
				class="absolute inset-0 h-full w-full rounded-lg object-cover p-1 transition-opacity duration-500"
				style="opacity: {index === currentIndex ? 1 : 0}"
			/>
		{/each}
	{/if}
	<div class="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 transform space-x-2">
		{#each $problemsImages as _, index}
			<button
				class="h-2 w-2 rounded-full bg-white transition-opacity duration-300"
				class:bg-opacity-50={index !== currentIndex}
				onclick={() => selectImage(index)}
				aria-label="Select image {index + 1}"
			></button>
		{/each}
	</div>
</div>
