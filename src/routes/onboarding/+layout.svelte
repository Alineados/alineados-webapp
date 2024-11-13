<script lang="ts">
	import Check from '$lib/icons/AlineadosCheck.svelte';
	import Step1 from '$lib/icons/steps/Step1.svelte';
	import Step2 from '$lib/icons/steps/Step2.svelte';
	import Step3 from '$lib/icons/steps/Step3.svelte';
	import Step4 from '$lib/icons/steps/Step4.svelte';
	import Buttons from '$lib/modules/onboarding/components/Buttons.svelte';

	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	// Función para determinar si la ruta actual es 'first' o 'last'
	function getStepStatus() {
		const path = get(page).url.pathname;
		const isFirst = path.includes('onboarding/first');
		const isLast = path.includes('onboarding/fourth');
		return { isFirst, isLast };
	}

	// Obtener el estado inicial de las propiedades isFirst e isLast
	const { isFirst, isLast } = getStepStatus();

	function handleNext() {
		if (isLast) {
			goto('/onboarding/fourth'); // Ajusta la ruta final según sea necesario
		} else {
			const currentPath = window.location.pathname;
			const nextPath = getNextPath(currentPath);
			goto(nextPath);
		}
	}

	function handlePrevious() {
		const currentPath = window.location.pathname;
		const previousPath = getPreviousPath(currentPath);
		goto(previousPath);
	}

	function getNextPath(currentPath: string): string {
		if (currentPath.includes('onboarding/first')) return '/onboarding/second';
		if (currentPath.includes('onboarding/second')) return '/onboarding/third';
		if (currentPath.includes('onboarding/third')) return '/onboarding/fourth';
		return currentPath;
	}

	function getPreviousPath(currentPath: string): string {
		if (currentPath.includes('onboarding/fourth')) return '/onboarding/third';
		if (currentPath.includes('onboarding/third')) return '/onboarding/second';
		if (currentPath.includes('onboarding/second')) return '/onboarding/first';
		return currentPath;
	}
</script>

<div
	class="container relative hidden min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-6 lg:px-0"
>
	<aside
		class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:col-span-1 lg:flex"
	>
		<div class="absolute inset-0 flex flex-col bg-[#0F172A] px-6">
			<a href="https://alineados.com" class="mt-8 flex flex-row gap-2">
				<Check styleTw="size-6" />
				<p class="text-lg font-bold text-alineados_gray-50">Alineados</p>
			</a>
			<ul class="mt-20 flex flex-col gap-6">
				<li class="flex items-center gap-2">
					<Step1 fill="#0F172A" stroke="white" width={24} height={24} backgroundColor="white" />
					<span class="text-xs font-medium">Información básica</span>
				</li>
				<li class="flex items-center gap-2">
					<Step2 fill="#566994" stroke="#566994" width={24} height={24} backgroundColor="#0F172A" />
					<span class="text-xs font-medium text-[#566994]">Verificación de correo o celular</span>
				</li>
				<li class="flex items-center gap-2">
					<Step3 fill="#566994" stroke="#566994" width={24} height={24} backgroundColor="#0F172A" />
					<span class="text-xs font-medium text-[#566994]">Creación de contraseña</span>
				</li>
				<li class="flex items-center gap-2">
					<Step4 fill="#566994" stroke="#566994" width={24} height={24} backgroundColor="#0F172A" />
					<span class="text-xs font-medium text-[#566994]">¡Bienvenido!</span>
				</li>
			</ul>

			<div class="mt-[240px] flex flex-col gap-2">
				<p class="text-pretty text-lg font-medium">
					Inicia tu experiencia proporcionándonos algunos detalles acerca de ti.
				</p>
				<p class="text-sm font-medium text-[#566994]">
					Este procedimiento solo durará unos minutos.
				</p>
			</div>
		</div>
	</aside>

	<div class="col-span-5 flex h-full w-full flex-col px-[152px]">
		<div class="h-4/5">
			<slot />
		</div>
		<Buttons {isFirst} {isLast} on:next={handleNext} on:previous={handlePrevious} />
	</div>
</div>
