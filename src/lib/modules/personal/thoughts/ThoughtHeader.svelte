<script lang="ts">
	import { goto } from '$app/navigation';
	import MoreButtonSingleStory from '$lib/components/MoreButtonSingleStory.svelte';
	import MoreButtonThoughts from '$lib/components/MoreButtonThoughts.svelte';
	import BackArrow from '$lib/icons/BackArrow.svelte';
	import NewButton from '../thoughts/NewButton.svelte';

	let {
		status
	}: {
		status: 'new' | 'edit' | 'see';
		isSave?: boolean;
	} = $props();

	function handleGoBack() {
		goto('/personal/thoughts');
	}
</script>

<div class="flex flex-col gap-2 px-4 pb-4 md:px-8 lg:px-16">
	<p class="flex flex-row text-sm font-medium text-alineados-gray-600">
		<button 
			onclick={() => {
				goto('/personal');
			}}
			class="text-alineados-gray-600 hover:underline"
		>
			Personal
		</button>
		<span class="mx-1">/</span>
		<button
			onclick={() => {
				handleGoBack();
			}}
			class={`hover:underline ${status === 'edit' ? 'text-alineados-gray-600' : 'text-alineados-orange-900'}`}
		>
			Pensamientos
		</button>
		{#if status === 'edit'}
			<span class="mx-1">/</span>
			<span class="text-alineados-orange-900">Nuevo pensamiento</span>

		{/if}
	</p>
	<div
		class="flex flex-col gap-5 border-b border-alineados-gray-100 pb-4 lg:flex-row lg:justify-between"
	>
		<div class="flex basis-3/4 items-center gap-2">
			{#if status === 'edit'}
				<input
					placeholder="Ingresa el titulo del nuevo pensamiento"
					type="text"
					maxlength="40"
					value="Nuevo Pensamiento"
					class="w-full border-none bg-transparent text-5xl font-bold text-alineados-gray-900 focus:outline-none"
					readonly
				/>
			{:else}
				<p class="text-4xl font-bold text-alineados-gray-900">Pensamientos</p>
				<div class="ml-5 flex items-center gap-3"></div>
			{/if}
		</div>

		<div class="flex basis-1/4 flex-row justify-end gap-4 self-start pt-2">
			{#if status === 'new'}
				<NewButton status="new" title="Nuevo" />
				<MoreButtonThoughts />
			{:else if status === 'edit'}
				<NewButton status="edit" title="Guardar" onClick={handleGoBack}/>
				<a
					href="/personal/thoughts"
					class="focus group flex items-center gap-1 rounded-lg bg-alineados-gray-100 px-5 py-3 text-alineados-blue-900 transition duration-300 ease-in-out hover:shadow-lg"
				>
					<BackArrow class="size-4 font-bold text-alineados-blue-900" />
					<p class="text-xs font-medium">Regresar</p>
				</a>
				<MoreButtonSingleStory />
			{/if}
		</div>
	</div>
</div>
