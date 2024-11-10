<script lang="ts">
	import BlockEye from '$lib/icons/BlockEye.svelte';
	import NoBlockEye from '$lib/icons/NoBlockEye.svelte';
	import { Input } from '$lib/shared/ui/input';
	import { Label } from '$lib/shared/ui/label';

	// variables
	let { id, placeholder }: { id: string; placeholder: string } = $props();
	let showPassword = $state(false);

	// function to toggle password visibility
	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<div class="relative">
	<Input
		class="rounded-none border-0 border-b-2 border-alineados_gray-900 bg-transparent pr-10 font-medium outline-none"
		{id}
		{placeholder}
		type={showPassword ? 'text' : 'password'}
		autocapitalize="none"
		autocomplete="current-password"
		autocorrect="off"
	/>
	<button
		type="button"
		class="absolute inset-y-0 right-0 flex items-center pr-3"
		onclick={togglePasswordVisibility}
	>
		{#if showPassword}
			<NoBlockEye class="size-5 rounded-lg text-alineados_gray-400 hover:bg-alineados_gray-50" />
		{:else}
			<BlockEye class="size-5 rounded-lg text-alineados_gray-400 hover:bg-alineados_gray-50" />
		{/if}
	</button>
</div>
