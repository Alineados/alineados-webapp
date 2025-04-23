<script lang="ts">
    import type { PageProps } from './$types';
    import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
    import PersonalStatistics from '$lib/modules/personal/PersonalStatistics.svelte';
    import ThoughtItem from '$lib/modules/personal/thoughts/ThoughtItem.svelte';
    import ThoughtCarousel from '$lib/modules/personal/thoughts/ThoughtCarousel.svelte';
    import ThoughtFilter from '$lib/modules/personal/thoughts/ThoughtFilter.svelte';
    import ThoughtHeader from '$lib/modules/personal/thoughts/ThoughtHeader.svelte';
    import type { DataPurpose, Thought } from '$lib/interfaces';
    import { pillarState, purposesState, thoughtsState } from '$lib/stores';
    import AlertDialog from '$lib/components/AlertDialog.svelte';
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import Loader from '$lib/shared/ui/loader/loader.svelte';

    import Health from '$lib/icons/Health.svelte';
    import Relational from '$lib/icons/Relational.svelte';
    import Vocacional from '$lib/icons/Vocacional.svelte';
    import Spiritual from '$lib/icons/Spiritual.svelte';
    import Purpose from '$lib/icons/Purpose.svelte';
    import CardFilter from '$lib/components/CardFilter.svelte';
    import SelectablePill from '$lib/components/SelectablePill.svelte';
    import ChevronLeft from '$lib/icons/ChevronLeft.svelte';
    import ChevronRight from '$lib/icons/ChevronRight.svelte';

    let selectedType = $state('pillar');
    let { data }: PageProps = $props();
    const { thoughts, purposes } = data;

    let isLoading = $state(true);
    let visibleThoughts = $state<Thought[]>([]);
    const BATCH_SIZE = 10;

    purposesState.init(purposes);
    thoughtsState.init(thoughts);

    // Transform pillars into carousel items
    const pillarItems = [
        {
            id: pillarState.health.id,
            icon: Health,
            label: pillarState.health.label
        },
        {
            id: pillarState.relational.id,
            icon: Relational,
            label: pillarState.relational.label
        },
        {
            id: pillarState.vocational.id,
            icon: Vocacional,
            label: pillarState.vocational.label
        },
        {
            id: pillarState.spiritual.id,
            icon: Spiritual,
            label: pillarState.spiritual.label
        }
    ];

    // Transform purposes into carousel items
    const purposeItems = purposesState.purposes.map((purpose, index) => ({
        id: purpose.id,
        icon: Purpose,
        label: purpose.label
    }));

    let formHtml: HTMLFormElement | null = $state(null);
    let actionType = $state<'delete' | 'important'>('delete');
    let openModalDelete = $state(false);
    let thoughtSelected: Thought | null = $state(null);
    let loading = $state(false);

    function handleDelete(thought: Thought) {
        thoughtSelected = thought;
        actionType = 'delete';
        openModalDelete = true;
    }

    async function handleImportant(thought: Thought) {
        // Primero establecemos el tipo y el pensamiento seleccionado
        actionType = 'important';
        thoughtSelected = thought;

        // Esperamos al siguiente tick para asegurarnos de que actionType se ha actualizado
        await Promise.resolve();

        // Actualización optimista
        thoughtsState.updateImportant(thought.id, !thought.is_important);

        // Ahora enviamos el formulario
        if (formHtml) formHtml.requestSubmit();
    }

    function submitForm(e: any) {
        e.preventDefault();
        e.stopPropagation();

        if (thoughtSelected && formHtml) {
            // Verificación adicional del tipo de acción
            if (actionType === 'delete' && !openModalDelete) {
                return;
            }
            formHtml.requestSubmit();
        }

        if (actionType === 'delete') {
            setTimeout(() => {
                openModalDelete = false;
            }, 500);
        }
    }

    $inspect({ actionType });


    // Filter state for pillars/purposes
let cardFilter = $state<{
    pillar: boolean;
    purpose: boolean;
}>({
    pillar: true,
    purpose: false
});

function changeFilter(filter: keyof typeof cardFilter) {
    cardFilter.pillar = false;
    cardFilter.purpose = false;
    cardFilter[filter] = true;
    selectedType = filter;
}

// Scroll functionality
// Scroll container and chevron state
let scrollContainer: HTMLDivElement;
let showLeftChevron = $state(false);
let showRightChevron = $state(false);

// Selected item tracking
let selectedItemId = $state<string | undefined>(undefined);

    function handlePillSelect(id: string) {
        // Toggle selection: if clicking the same item, deselect it
        selectedItemId = selectedItemId === id ? undefined : id;
        // Filter thoughts based on selection
        thoughtsState.filter(selectedType, selectedItemId);
    }


function checkScrollability() {
    if (!scrollContainer) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    showLeftChevron = scrollLeft > 0;
    showRightChevron = Math.ceil(scrollLeft + clientWidth) < scrollWidth;
}

function scroll(direction: 'left' | 'right') {
    if (!scrollContainer) return;
    const scrollAmount = direction === 'left' ? -200 : 200;
    scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}
</script>

<PersonalHeader>
	{#snippet header()}
		<ThoughtHeader status="new" />
	{/snippet}

	{#snippet statistics()}
		<PersonalStatistics
			type="thoughts"
			bind:first={thoughtsState.thoughtsCount}
			bind:second={thoughtsState.importantCount}
		/>
	{/snippet}

	{#snippet filter()}
		<ThoughtFilter bind:selectedType />
	{/snippet}
</PersonalHeader>

<!-- Filter section -->
<div class=" bg-white">
    <div class="px-4 md:px-8 lg:px-16">
        <div class="flex flex-row gap-2 mb-2">
            <CardFilter
                type="complex"
                text="Pilar"
                bind:selected={cardFilter.pillar}
                triggerFunction={() => changeFilter('pillar')}
            />
            <CardFilter
                type="complex"
                text="Fin"
                bind:selected={cardFilter.purpose}
                triggerFunction={() => changeFilter('purpose')}
            />
        </div>

        <div class="relative flex w-full items-center gap-2">
            {#if showLeftChevron}
                <button
                    onclick={() => scroll('left')}
                    class="flex h-8 items-center justify-center hover:text-alineados-gray-600"
                >
                    <ChevronLeft styleTw="h-6 w-6 text-alineados-gray-400" />
                </button>
            {/if}

            <div class="relative w-full">
                <div
                    bind:this={scrollContainer}
                    onscroll={checkScrollability}
                    class="flex overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
                >
                    <div class="flex flex-nowrap gap-2">
                        {#if selectedType === 'pillar'}
							{#each pillarItems as item}
								<SelectablePill
									isLink={false}
									pid={item.id}
									name={item.label}
									text={item.label}
									selected={selectedItemId === item.id}
									onInput={() => handlePillSelect(item.id)}
								/>
							{/each}
						{:else}
							{#each purposeItems as item}
								<SelectablePill
									isLink={false}
									pid={item.id}
									name={item.label}
									text={item.label}
									selected={selectedItemId === item.id}
									onInput={() => handlePillSelect(item.id)}
								/>
							{/each}
						{/if}
                    </div>
                </div>
            </div>

            {#if showRightChevron}
                <button
                    onclick={() => scroll('right')}
                    class="flex h-8 items-center justify-center hover:text-alineados-gray-600"
                >
                    <ChevronRight styleTw="h-6 w-6 text-alineados-gray-400" />
                </button>
            {/if}
        </div>
    </div>
</div>

<!-- Remove the duplicate carousel and filter sections -->
<!-- Spacing for fixed header -->
<div class="h-6" />

<!-- <div class="top-[300px] w-full bg-white pb-4">
	<ThoughtCarousel
		items={selectedType === 'pillar' ? pillarItems : purposeItems}
		type={selectedType}
	/>
</div> -->

<form
	bind:this={formHtml}
	method="POST"
	action={actionType === 'delete' ? '?/delete' : '?/updateImportant'}
	use:enhance={({ formData, action }) => {
		loading = true;

		// Verificación adicional del action
		const currentAction = action.toString().split('?/')[1];
		if (currentAction !== actionType) {
			loading = false;
			return;
		}

		if (thoughtSelected?.id) {
			formData.set('tid', thoughtSelected.id);
			if (actionType === 'important') {
				formData.set('isImportant', (!thoughtSelected.is_important).toString());
			}
		}

		return async ({ result }) => {
			if (result.status === 200) {
				if (actionType === 'delete') {
					thoughtsState.deleteThought(thoughtSelected?.id || '');
				}
			} else {
				if (actionType === 'important' && thoughtSelected) {
					thoughtsState.updateImportant(thoughtSelected.id, thoughtSelected.is_important);
				}
			}
			loading = false;
		};
	}}
>
	<div class="flex flex-col items-center justify-center gap-4 px-32">
		{#if thoughtsState.thoughtsFiltered.length === 0}
			<p class="text-alineados-gray-400">
				No hay pensamientos, haz clic en el botón de "Nuevo" para agregar uno.
			</p>
		{:else}
			{#each thoughtsState.thoughtsFiltered as thought}
				<ThoughtItem
					{thought}
					w_size="w-full"
					deleteItem={() => handleDelete(thought)}
					prominentItem={() => handleImportant(thought)}
				/>
			{/each}
		{/if}
	</div>
</form>

<AlertDialog
	bind:open={openModalDelete}
	title="Eliminar pensamiento"
	description="¿Estás seguro de que deseas eliminar este pensamiento?"
	cancel="Cancelar"
	action="Eliminar"
	handleCancel={() => (openModalDelete = false)}
	handleAction={submitForm}
/>


<!-- Rest of the form and content remains the same -->
