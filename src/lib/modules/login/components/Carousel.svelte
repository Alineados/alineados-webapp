<script lang="ts">
	import * as Carousel from '$lib/shared/ui/carousel/index';
	import * as Card from '$lib/shared/ui/card/index';
	import type { CarouselAPI } from '$lib/shared/ui/carousel/context';

	let api = $state<CarouselAPI>();

	const count = $derived(api ? api.scrollSnapList().length : 0);
	let current = $state(0);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});
</script>

<!-- setApi={(emblaApi) => (api = emblaApi)} -->
<div class="relative z-20 mt-auto">
	<Carousel.Root {api} class="w-full max-w-xs">
		<Carousel.Content>
			{#each Array(5) as _, i (i)}
				<Carousel.Item>
					<Card.Root>
						<Card.Content class="flex aspect-square items-center justify-center p-6">
							<span class="text-4xl font-semibold">{i + 1}</span>
						</Card.Content>
					</Card.Root>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
	<div class="py-2 text-center text-sm text-muted-foreground">
		Slide {current} of {count}
	</div>
</div>
