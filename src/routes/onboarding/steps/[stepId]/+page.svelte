<script lang="ts">
	import { page } from '$app/stores';

	import Buttons from '$lib/modules/onboarding/components/Buttons.svelte';
	import RegisterForm from '$lib/modules/onboarding/RegisterForm.svelte';
	import EmailVerification from '$lib/modules/onboarding/EmailVerification.svelte';
	import PasswordCreation from '$lib/modules/onboarding/PasswordCreation.svelte';
	import Welcome from '$lib/modules/onboarding/Welcome.svelte';
	import AsideSteps from '$lib/modules/onboarding/components/AsideSteps.svelte';

	import Check from '$lib/icons/AlineadosCheck.svelte';

	let stepId: string;
	let isFirst = false;
	let isLast = false;

	$: stepId = $page.params.stepId;

	$: isFirst = stepId === '1';
	$: isLast = stepId === '4';

	$: nextStep = `/onboarding/steps/${parseInt(stepId) + 1}`;
	$: previousStep = `/onboarding/steps/${parseInt(stepId) - 1}`;
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
		<div class="h-4/5">
			{#if stepId === '1'}
				<RegisterForm form={}/>
			{:else if stepId === '2'}
				<EmailVerification />
			{:else if stepId === '3'}
				<PasswordCreation />
			{:else if stepId === '4'}
				<Welcome />
			{/if}
		</div>
		<Buttons {isFirst} {isLast} {nextStep} {previousStep} />
	</div>
</div>
