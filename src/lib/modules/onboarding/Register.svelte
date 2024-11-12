<script lang="ts">
	import Check from '$lib/icons/AlineadosCheck.svelte';
	import { Button } from '$lib/shared/ui/button/index';
	import RegisterForm from './components/RegisterForm.svelte';
</script>

<div
	class="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-5 lg:px-0"
>
	<aside
		class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:col-span-1 lg:flex"
	>
		<div class="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-[#20325D]">
			<Button
				href="alineados.com"
				variant="ghost"
				class="absolute left-4 top-4 flex flex-row gap-2  md:left-4 md:top-8"
			>
				<Check styleTw="size-6" />
				<p class="text-xl font-bold text-alineados_gray-50">Alineados</p>
			</Button>
		</div>
	</aside>

	<div class="flex flex-col justify-start lg:col-span-4 lg:p-16">
		<div class=" flex flex-col justify-start space-y-6 sm:w-[350px]">
			<div class="flex flex-col gap-8">
				<h1 class="text-4xl font-medium tracking-tight text-alineados_gray-900">
					Datos Personales
				</h1>
				<hr />
			</div>
			<RegisterForm />
		</div>
	</div>
</div>
