<script lang="ts">
	import AsideSteps from '$lib/modules/onboarding/components/AsideSteps.svelte';
	import Check from '$lib/icons/AlineadosCheck.svelte';

	import { page } from '$app/stores';
	const stepId = $derived($page.params.stepId);

	let { children } = $props();
</script>

<div
	class="container relative hidden min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-6 lg:px-0"
>
	<aside
		class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:col-span-1 lg:flex"
	>
		<div class="absolute inset-0 flex h-full flex-col justify-between bg-[#0F172A] px-6">
			<div>
				<a href="https://alineados.com" class="mt-8 flex flex-row gap-2">
					<Check styleTw="size-6" />
					<p class="text-lg font-bold text-alineados-gray-50">Alineados</p>
				</a>

				<AsideSteps {stepId} />
			</div>

			{#if stepId !== '4'}
				<div class="flex flex-col gap-2 pb-12">
					<p class="text-pretty text-lg font-medium">
						Inicia tu experiencia proporcionándonos algunos detalles acerca de ti.
					</p>
					<p class="text-sm font-medium text-[#566994]">
						Este procedimiento solo durará unos minutos.
					</p>
				</div>
			{/if}
		</div>
	</aside>

	<div class="col-span-5 flex h-full w-full flex-col px-[152px]">
		{@render children()}
	</div>
</div>
