<script lang="ts">
	import Autoplay from 'embla-carousel-autoplay';
	import * as Carousel from '$lib/shared/ui/carousel/index.js';
	import type { CarouselAPI } from '$lib/shared/ui/carousel/context.js';
	import CarouselContent from './CarouselContent.svelte';

	let api = $state<CarouselAPI>();

	const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });

	const count = $derived(api ? api.scrollSnapList().length : 0);
	let current = $state(0);

	// Function to determine the color based on the index
	function getColor(index: number) {
		return index === current ? 'bg-white' : 'bg-[#1E2E54]';
	}

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});
</script>

<div>
	<Carousel.Root
		bind:api
		plugins={[plugin]}
		class="flex px-56 flex-col justify-between"
		onmouseenter={plugin.stop}
		onmouseleave={plugin.reset}
	>
		<Carousel.Content >
			{#each Array(3) as _, i (i)}
				<Carousel.Item class="flex flex-row justify-center gap-2">
					{#each Array(3) as _, i (i)}
						<div
							class="flex  aspect-square items-center justify-center rounded-full p-1 {getColor(
								i + 1
							)}"
						></div>
					{/each}
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous class="bg-white text-[#0F172A]" />
		<Carousel.Next class="bg-white text-[#0F172A]" />
	</Carousel.Root>
</div>
