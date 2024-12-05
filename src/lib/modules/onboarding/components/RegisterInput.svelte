<script lang="ts">
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';

	let {
		label,
		forId,
		type = 'text',
		placeholder,
		errorMessage = '*Campo requerido',
		isInvalid = true
	} = $props();
</script>

<div class="w-1/2 space-y-2">
	<Label class="text-lg font-semibold text-black" for={forId}>{label}</Label>
	<Input
		class="rounded-lg border-alineados-gray-100 bg-alineados-gray-50 text-base font-normal placeholder:text-alineados-gray-500"
		id={forId}
		{type}
		{placeholder}
		autocapitalize="none"
		autocorrect="off"
	/>
	{#if isInvalid}
		<span class="text-xs text-[#C90404]">{errorMessage}</span>
	{/if}
</div>
