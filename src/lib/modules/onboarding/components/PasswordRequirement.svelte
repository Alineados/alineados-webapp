<script lang="ts">
	import Check from '$lib/icons/CircleCheckSolid.svelte';
	import Cross from '$lib/icons/CircleCrossSolid.svelte';
	import { ValidationType } from '$lib/interfaces/Validations.interface';

	// Props
	let {
		message = '',
		type = ValidationType.ALL_GOOD,
		checked = false,
		currentValidation = [] as ValidationType[]
	}: {
		message: string;
		type: ValidationType;
		checked: boolean;
		currentValidation: ValidationType[];
	} = $props();

	let isError = $derived(currentValidation.includes(type));
	let color = $derived(checked ? '#7BB026' : isError ? '#C90404' : '#7E7E7E');
</script>

<div class="flex items-center gap-2" style="color: {color}">
	{#if checked}
		<Check styleTw="size-6" />
	{:else}
		<Cross styleTw="size-6" />
	{/if}
	<p class="text-sm font-semibold">
		{message}
	</p>
</div>
