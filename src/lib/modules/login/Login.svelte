<script lang="ts">
	import Check from '$lib/icons/Check.svelte';
	import { Button } from '$lib/shared/ui/button/index';
	import LoginForm from './components/LoginForm.svelte';
	// import Carousel from './components/Carousel.svelte';
</script>

<div
	class="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<Button
		href="alineados.com"
		variant="ghost"
		class="absolute left-4 top-4 flex flex-row gap-2  md:left-8 md:top-8"
	>
		<Check styleTw="size-10" />
		<p
			class="text-4xl
	font-bold text-alineados_gray-900"
		>
			Alineados
		</p>
	</Button>
	<div class="flex flex-col justify-start lg:p-16">
		<div class=" flex flex-col justify-start space-y-6 sm:w-[350px]">
			<div class="flex flex-col gap-8">
				<h1 class="text-4xl font-medium tracking-tight text-alineados_gray-900">
					Bienvenido de nuevo a tu propia herramienta de vida
				</h1>
				<p class="text-base font-medium text-alineados_gray-900">
					Hoy es un nuevo día. Es tu día Inicia sesión para comenzar a gestionar tu alineación
				</p>
			</div>
			<LoginForm />
		</div>
	</div>
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div class="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-[#20325D]"></div>

		<div class="relative z-20 mt-auto">
			<!-- Image -->
			<!-- <Carousel /> -->
			<!-- Carousel -->
		</div>
	</div>
</div>
