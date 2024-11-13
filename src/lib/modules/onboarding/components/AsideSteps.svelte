<script lang="ts">
	import Step1 from '$lib/icons/steps/Step1.svelte';
	import Step2 from '$lib/icons/steps/Step2.svelte';
	import Step3 from '$lib/icons/steps/Step3.svelte';
	import Step4 from '$lib/icons/steps/Step4.svelte';

	export let stepId: string;
</script>

<ul class="mt-20 flex flex-col gap-6">
	<li class="flex items-center gap-2">
		{#if stepId === '1'}
			<Step1 fill="#0F172A" stroke="white" width={24} height={24} backgroundColor="white" />
			<span class="text-xs font-medium text-white">Información básica</span>
		{:else}
			<Step1 fill="#566994" stroke="#566994" width={24} height={24} backgroundColor="#0F172A" />
			<span class="text-xs font-medium text-[#566994]">Información básica</span>
		{/if}
	</li>
	<li class="flex items-center gap-2">
		{#if stepId === '2'}
			<Step2 fill="#0F172A" stroke="white" width={24} height={24} backgroundColor="white" />
			<span class="text-xs font-medium text-white">Verificación de correo o celular</span>
		{:else}
			<Step2 fill="#566994" stroke="#566994" width={24} height={24} backgroundColor="#0F172A" />
			<span class="text-xs font-medium text-[#566994]">Verificación de correo o celular</span>
		{/if}
	</li>
	<li class="flex items-center gap-2">
		{#if stepId === '3'}
			<Step3 fill="#0F172A" stroke="white" width={24} height={24} backgroundColor="white" />
			<span class="text-xs font-medium text-white">Creación de contraseña</span>
		{:else}
			<Step3 fill="#566994" stroke="#566994" width={24} height={24} backgroundColor="#0F172A" />
			<span class="text-xs font-medium text-[#566994]">Creación de contraseña</span>
		{/if}
	</li>
	<li class="flex items-center gap-2">
		{#if stepId === '4'}
			<Step4 fill="#0F172A" stroke="white" width={24} height={24} backgroundColor="white" />
			<span class="text-xs font-medium text-white">¡Bienvenido!</span>
		{:else}
			<Step4 fill="#566994" stroke="#566994" width={24} height={24} backgroundColor="#0F172A" />
			<span class="text-xs font-medium text-[#566994]">¡Bienvenido!</span>
		{/if}
	</li>
</ul>
