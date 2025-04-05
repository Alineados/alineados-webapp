<script lang="ts">
    import { goto } from '$app/navigation';
    import AlertDialog from '$lib/components/AlertDialog.svelte';
    import BackArrow from '$lib/icons/BackArrow.svelte';
    import Cloud from '$lib/icons/Cloud.svelte';
    import Loading from '$lib/icons/Loading.svelte';
    import { storyState } from '$lib/stores';
    import NewButton from '../NewButton.svelte';
    import { page } from '$app/stores';
	import MoreButtonStories from '$lib/components/MoreButtonStories.svelte';
	import MoreButtonSingleStory from '$lib/components/MoreButtonSingleStory.svelte';

    let {
        status,
        isSave = $bindable(),
        title = $bindable()
    }: {
        status: 'new' | 'edit' | 'see';
        isSave?: boolean;
        title?: string;
    } = $props();

    // Initialize title if undefined in 'see' mode
    $effect(() => {
        if (status === 'see') {
            title = $page.data.story.story_name;
        }
    });

    function handleGoBack() {
        goto('/personal/stories');
    }

	let isFocused = $state(false);
</script>

<div class="flex flex-col gap-2 px-4 pb-6 md:px-8 lg:px-16">
	<p class="flex flex-row text-sm font-medium text-alineados-gray-600">
		<button class="text-alineados-gray-600 hover:underline">
			Personal
		</button>
		<!-- <a href="/personal/stories" class="text-alineados-gray-600 hover:underline">Personal</a> -->
		<span class="mx-1">/</span>
		<button onclick={handleGoBack} class="text-alineados-gray-600 hover:underline">
			Relatos
		</button>
		{#if title}
			<span class="mx-1">/</span>
			<span class="text-alineados-orange-900">{title}</span>
		{/if}
	</p>
	<div
		class="flex flex-col gap-5 border-b border-alineados-gray-100 pb-4 lg:flex-row lg:justify-between"
	>
		<div class="flex basis-3/4 items-center gap-2">
			{#if status === 'edit'}
				<input
					placeholder={isFocused ? "" : "Titulo del nuevo relato"}
					type="text"
					maxlength="40"
					bind:value={title}
					onfocus={() => isFocused = true}
    				onblur={() => isFocused = false}
					class="relative bg-transparent text-5xl font-bold text-alineados-gray-900 focus:outline-none rounded-md px-2 {!title ? 'border-2 animate-border-cursor-blink' : 'border-none'} focus:border-alineados-orange-500 [caret-width:3px] [caret-color:alineados-orange-900]"
				/>
			{:else if status === 'see' && title}
				<p class="text-4xl font-bold text-alineados-gray-900">{title}</p>
			{:else}
				<p class="text-4xl font-bold text-alineados-gray-900">Relatos</p>
			{/if}
			<div class="ml-5 flex items-center gap-3"></div>
		</div>

		<div class="flex basis-1/4 flex-row justify-end gap-4 items-center self-start pt-2">
			<!-- Autosave -->
			{#if status !== 'new'}
				{#if storyState.autosave}
					<Loading style="h-7 w-7 animate-spin text-alineados-gray-400" />
				{:else}
					<Cloud styleTw="size-7 text-alineados-gray-400" />
				{/if}
			{/if}

			{#if status === 'new'}
				<NewButton status="new" title="Nuevo" />
				<MoreButtonStories />
			{:else if status === 'edit'}
				<NewButton status="edit" title="Ver" />
			{:else if status === 'see'}
				<NewButton status="see" title="Editar" />
			{/if}

			{#if status !== 'new'}
				<!-- return button -->
				<a
					href="/personal/stories"
					class="focus group flex items-center gap-1 rounded-lg bg-alineados-gray-100 px-5 py-3 text-alineados-blue-900 transition duration-300 ease-in-out hover:shadow-lg"
				>
					<BackArrow class="size-4 font-bold text-alineados-blue-900" />
					<p class="text-xs font-medium">Regresar</p>
				</a>
			{/if}
			{#if status === 'see'}
				<MoreButtonSingleStory />
			{/if}
		</div>
	</div>
</div>

<!-- <AlertDialog
	bind:open={openModal}
	title="Información sin guardar"
	description="¿Estás seguro que deseas regresar? Se perderán los cambios realizados."
	cancel="Cancelar"
	action="Regresar"
	handleCancel={() => (openModal = false)}
	handleAction={() => handleGoBack()}
/> -->
