<script lang="ts">
	import Check from '$lib/icons/CircleCheckSolid.svelte';
	import Cross from '$lib/icons/Cross.svelte';

	let {
		strengthening = 1 // 1, 2, 3
	}: {
		strengthening?: number;
	} = $props();
</script>

<div class="flex items-center gap-2">
	{#if strengthening !== 3}
		<Cross width={18} height={18} />
	{:else}
		<Check width={18} height={18} fill={'#7BB026'} />
	{/if}

	<p class="text-sm font-semibold" style="color: {strengthening === 3 ? '#7BB026' : '#7E7E7E'};">
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
