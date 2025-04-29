<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    // import History from '$lib/icons/History.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import InformationIcon from '$lib/icons/InformationIcon.svelte';
    // import ThumbsUp from '$lib/icons/ThumbsUp.svelte';
    // import ThumbsDown from '$lib/icons/ThumbsDown.svelte';
    import { nanoid } from 'nanoid';

    let { type }: { type: 'positive' | 'improve' } = $props();

    let pastActions = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    let isOnlyText = $state(true);

    function addAction(id: string) {
        pastActions = [...pastActions, { id: nanoid(), description: '', prominent: false, daily: false }];
    }

    function removeAction(id: string) {
        if (pastActions[pastActions.length - 1].id !== id && pastActions.find(e => e.id === id)?.description !== '') {
            pastActions = pastActions.filter(e => e.id !== id);
        }
    }

    function toggleProminent(id: string) {
        pastActions = pastActions.map(e => 
            e.id === id ? { ...e, prominent: !e.prominent } : e
        );
    }

    function toggleDaily(id: string) {
        pastActions = pastActions.map(e => 
            e.id === id ? { ...e, daily: !e.daily } : e
        );
    }

    const title = type === 'positive' ? 'Acciones Pasado - Positivas' : 'Acciones Pasado - Por Mejorar';
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <!-- {#if type === 'positive'}
            <ThumbsUp styleTw="size-6 text-alineados-gray-900" />
        {:else}
            <ThumbsDown styleTw="size-6 text-alineados-gray-900" />
        {/if} -->
        <h2 class="text-2xl font-medium text-alineados-gray-900">{title}</h2>
        <Tooltip
            open={false}
            messages={[
                type === 'positive' 
                    ? 'Acciones pasadas que han tenido un impacto positivo'
                    : 'Acciones pasadas que necesitan mejorarse',
                'Registra las acciones y sus resultados'
            ]}
        >
            <InformationIcon styleTw="size-4" />
        </Tooltip>
    </div>
    <div class="-ml-10 mt-5 flex flex-col gap-2">
        {#each pastActions as action}
            <Item
                deleteItem={() => removeAction(action.id)}
                addItem={() => addAction(action.id)}
                prominentItem={() => toggleProminent(action.id)}
                dailyItem={() => toggleDaily(action.id)}
                onInput={() => {
                    if (pastActions[pastActions.length - 1].description !== '') {
                        addAction(action.id);
                    }
                    if (action.description === '') {
                        removeAction(action.id);
                    }
                }}
                bind:isOnlyText
                bind:isDaily={action.daily}
                bind:isStarred={action.prominent}
                bind:value={action.description}
            />
        {/each}
    </div>
</div>
