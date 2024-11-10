<script lang="ts">
	import Aside from '$lib/modules/auth/components/Aside.svelte';
	import Carousel from '$lib/modules/auth/components/Carousel.svelte';
	import CarouselContent from '$lib/modules/auth/components/CarouselContent.svelte';
	import ContentSide from '$lib/modules/auth/components/ContentSide.svelte';
	import Header from '$lib/modules/auth/components/Header.svelte';
	import LoginForm from '$lib/modules/auth/LoginForm.svelte';
</script>

<ContentSide>
	<Header
		title="Bienvenido de nuevo a tu propia herramienta de vida"
		description="Hoy es un nuevo día. Es tu día. 
		Inicia sesión para comenzar a gestionar tu alineación"
	/>
	<LoginForm />
</ContentSide>

<Aside>
	<CarouselContent />
	<Carousel />
</Aside>
