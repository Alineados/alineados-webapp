<script lang="ts">
	import { Label } from '$lib/shared/ui/label/index';
	import { Input } from '$lib/shared/ui/input/index';
	import EyeOff from '$lib/icons/BlockEye.svelte';
	import Eye from '$lib/icons/NoBlockEye.svelte';

	export let label: string = 'Contraseña';
	export let id: string = 'password';
	export let placeholder: string = 'Ingrese su contraseña';
	export let isLoading: boolean = false;

	let isPasswordVisible = false;

	function togglePasswordVisibility() {
		isPasswordVisible = !isPasswordVisible;
	}
</script>

<div class="w-3/5 space-y-2">
	<Label class="text-lg font-semibold text-black" for={id}>{label}</Label>
	<div class="relative w-full">
		<Input
			class="w-full rounded-lg border-alineados_gray-100 bg-alineados_gray-50 pr-10 text-base font-normal placeholder:text-alineados_gray-500"
			{id}
			{placeholder}
			type={isPasswordVisible ? 'text' : 'password'}
			autocapitalize="none"
			autocorrect="off"
			disabled={isLoading}
		/>
		<button
			type="button"
			class="absolute inset-y-0 right-0 flex items-center pr-3"
			on:click={togglePasswordVisibility}
		>
			{#if isPasswordVisible}
				<EyeOff class="h-5 w-5 text-alineados_gray-500" />
			{:else}
				<Eye class="h-5 w-5 text-alineados_gray-500" />
			{/if}
		</button>
	</div>
</div>
