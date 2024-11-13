<script lang="ts">
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';

	export let label: string;
	export let forId: string;
	export let type: string = 'text';
	export let placeholder: string;
	export let errorMessage: string = 'Campo requerido';
	export let isLoading: boolean = false;
	export let isInvalid: boolean = false;
</script>

<div class="w-1/2 space-y-2">
	<Label class="text-lg font-semibold text-black" for={forId}>{label}</Label>
	<Input
		class="rounded-lg border-alineados_gray-100 bg-alineados_gray-50 text-sm font-normal placeholder:text-alineados_gray-500"
		id={forId}
		{type}
		{placeholder}
		autocapitalize="none"
		autocorrect="off"
		disabled={isLoading}
	/>
	{#if isInvalid}
		<span class="text-xs text-[#C90404]">{errorMessage}</span>
	{/if}
</div>
