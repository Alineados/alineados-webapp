<script lang="ts">
	import Aside from '$lib/modules/auth/components/Aside.svelte';
	import Carousel from '$lib/modules/auth/components/Carousel.svelte';
	import CarouselContent from '$lib/modules/auth/components/CarouselContent.svelte';
	import ContentSide from '$lib/modules/auth/components/ContentSide.svelte';
	import Header from '$lib/modules/auth/components/Header.svelte';
	import RegisterForm from '$lib/modules/auth/RegisterForm.svelte';
</script>

<ContentSide>
	<Header
		title="Bienvenido a Alineados"
		description="¡Hoy es un nuevo día! Estás a solo unos pasos de gestionar tu alineación. ¿Cómo te gustaría registrarte?"
	/>
	<RegisterForm />
</ContentSide>

<Aside>
	<CarouselContent />
	<Carousel />
</Aside>
