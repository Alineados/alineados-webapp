<script lang="ts">
	import Check from '$lib/icons/CircleCheckSolid.svelte';
	import Cross from '$lib/icons/CircleCrossSolid.svelte';
	import type { ValidationType } from '$lib/interfaces/Validations.interface';

	let {
		strengthening = 1, // 1, 2, 3
		validation = [] as ValidationType[]
	}: {
		strengthening?: number;
		validation: ValidationType[];
	} = $props();

	let color = $derived(
		validation.length !== 0 ? '#C90404' : strengthening === 3 ? '#7BB026' : '#7E7E7E'
	);
</script>

<div class="flex items-center gap-2" style="color: {color}">
	{#if strengthening !== 3}
		<Cross styleTw="size-6" />
	{:else}
		<Check styleTw="size-6" />
	{/if}

	<p class="text-sm font-semibold">
		Fortaleza de la contraseña:
		<span
			class:text-[#D90D0D]={strengthening === 1 || strengthening === 0}
			class:text-[#F5A623]={strengthening === 2}
			class:text-[#7BB026]={strengthening === 3}
		>
			{#if strengthening === 1}
				débil
			{:else if strengthening === 2}
				medio
			{:else if strengthening === 3}
				fuerte
			{:else if strengthening === 0}
				muy débil
			{/if}
		</span>
	</p>
</div>
