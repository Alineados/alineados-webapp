<script lang="ts">
	import * as Card from '$lib/shared/ui/card/index';
	import * as Carousel from '$lib/shared/ui/carousel/index';
	import type { CarouselAPI } from '$lib/shared/ui/carousel/context';
	import ThoughtItem from './ThoughtItem.svelte';

	let api = $state<CarouselAPI>();
	const count = $derived(api ? api.scrollSnapList().length : 0);
	let current = $state(0);
	let selectedCard = $state<number | null>(null);

	// Card data
	const pillars = [
		{ id: 1, title: 'Servicios', icon: '💼' },
		{ id: 2, title: 'Emergencias', icon: '✚' },
		{ id: 3, title: 'Historial', icon: '📋' },
		{ id: 4, title: 'Pacientes', icon: '👥' },
		{ id: 5, title: 'Consultas', icon: '💼' }
	];

    const fins = [
        { id: 1, title: 'Actitud', icon: '💼' },
        { id: 2, title: 'Amar', icon: '✚' },
        { id: 3, title: 'Dar', icon: '📋' },
        { id: 4, title: 'Entendimiento', icon: '👥' },
        { id: 5, title: 'Éxito', icon: '💼' },
        { id: 6, title: 'Relaciones', icon: '💼' },
        { id: 7, title: 'Resultados', icon: '💼' },
        { id: 8, title: 'Servir', icon: '💼' },
        { id: 9, title: 'Solución', icon: '💼' },
        { id: 10, title: 'Tiempo de calidad', icon: '💼' }
    ]

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});

	function handleCardClick(id: number) {
		selectedCard = id;
		// You can add your navigation or action logic here
		console.log(`Card ${id} clicked`);
	}
</script>

<div class="mx-auto w-full max-w-6xl px-4">
	<Carousel.Root setApi={(emblaApi) => (api = emblaApi)} class="w-full">
		<Carousel.Content class="flex flex-row justify-center">
			{#each pillars as card (card.id)}
				<Carousel.Item class="px-4">
					<ThoughtItem
						onSelectedCard={() => handleCardClick(card.id)}
						icon="✚"
						title={card.title}
						isActive={selectedCard === card.id}
						id={card.id}
					/>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<div class="mt-8 flex items-center justify-center gap-2">
			<Carousel.Previous class="relative left-0 right-auto" />
			<div class="text-sm text-muted-foreground">
				{current} / {count}
			</div>
			<Carousel.Next class="relative left-auto right-0" />
		</div>
	</Carousel.Root>
</div>

<style>
	:global(.embla__slide) {
		flex: 0 0 auto;
		min-width: 0;
		max-width: 50%;
	}
</style>
