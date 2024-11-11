<script lang="ts">
	import Check from '$lib/icons/Check.svelte';
	import Step1 from '$lib/icons/steps/Step1.svelte';
	import Step2 from '$lib/icons/steps/Step2.svelte';
	import Step3 from '$lib/icons/steps/Step3.svelte';
	import Step4 from '$lib/icons/steps/Step4.svelte';
</script>

<div
	class="container relative hidden min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-5 lg:px-0"
>
	<aside
		class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:col-span-1 lg:flex"
	>
		<div class="absolute inset-0 flex flex-col bg-gradient-to-t from-[#0F172A] to-[#20325D] p-4">
			<a href="https://alineados.com" class="flex flex-row gap-2">
				<Check styleTw="size-6" />
				<p class="text-xl font-bold text-alineados_gray-50">Alineados</p>
			</a>
			<ul class="mt-8 flex flex-col space-y-2">
				<li class="flex items-center space-x-2">
					<Step1 fill="#0F172A" stroke="white" width={24} height={24} backgroundColor="white" />
					<span>Información básica</span>
				</li>
				<li class="flex items-center space-x-2">
					<Step2 fill="#0F172A" stroke="#B1B1B1" width={50} height={50} />
					<span>Información básica</span>
				</li>
				<li class="flex items-center space-x-2">
					<Step3 fill="#0F172A" stroke="#B1B1B1" width={50} height={50} />
					<span>Información básica</span>
				</li>
				<li class="flex items-center space-x-2">
					<Step4 fill="#0F172A" stroke="#B1B1B1" width={50} height={50} />
					<span>Información básica</span>
				</li>
			</ul>
		</div>
	</aside>

	<div class="flex flex-col justify-start lg:col-span-4 lg:p-16">
		<slot />
	</div>
</div>
