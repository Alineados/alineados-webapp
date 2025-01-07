<script lang="ts">
	import Pencil from '$lib/icons/Pencil.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import Save from '$lib/icons/Save.svelte';
	let { status, title }: { status: 'new' | 'edit' | 'see'; title: string } = $props();
</script>

<button
	class="focus group flex items-center gap-[4px] rounded-lg bg-alineados-blue-900 px-5 py-3 text-white transition duration-300 ease-in-out hover:shadow-lg"
	aria-label="Rendir Cuentas"
>
	{#if status === 'new'}
		<Plus styleTw="size-4" />
		<p class="text-xs font-medium">
			{title}
		</p>
	{:else if status === 'edit'}
		<Save styleTw="size-4" />
		<p class="text-xs font-medium">{title}</p>
	{:else if status === 'see'}
		<Pencil styleTw="size-4" />
		<p class="text-xs font-medium">{title}</p>
	{/if}
</button>
