<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Loading from '$lib/icons/Loading.svelte';
	import Pencil from '$lib/icons/Pencil.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import Save from '$lib/icons/Save.svelte';
	import type { Story } from '$lib/interfaces';
	import type { Response } from '$lib/services/http';
	let { status, title }: { status: 'new' | 'edit' | 'see'; title: string } = $props();

	let formHtml: HTMLFormElement;
	let loading = $state(false);

	function handleOnClick() {
		if (status === 'new') formHtml.requestSubmit();
	}
</script>

<button
	class="focus group flex items-center gap-[4px] rounded-lg bg-alineados-blue-900 px-5 py-3 text-white transition duration-300 ease-in-out hover:shadow-lg"
	aria-label="Rendir Cuentas"
	onclick={handleOnClick}
>
	{#if status === 'new'}
		{#if loading}
			<div class="h-6 w-6 animate-spin text-white">
				<Loading />
			</div>
		{:else}
			<Plus styleTw="size-4" />
			<p class="text-xs font-medium">
				{title}
			</p>
		{/if}
	{:else if status === 'edit'}
		<Save styleTw="size-4" />
		<p class="text-xs font-medium">{title}</p>
	{:else if status === 'see'}
		<Pencil styleTw="size-4" />
		<p class="text-xs font-medium">{title}</p>
	{/if}
</button>

<form
	class="hidden"
	method="POST"
	action="?/new"
	bind:this={formHtml}
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		loading = true;

		return async ({ result, update }) => {
			if (result.status === 200 && result.type === 'success') {
				const { data }: { data: Story } = result.data as unknown as Response;

				if (result.status === 200 && data) goto(`./stories/edit/${data.id}`);

				loading = false;
			}
		};
	}}
></form>
