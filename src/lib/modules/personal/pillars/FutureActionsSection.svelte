<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    // import Future from '$lib/icons/Future.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import InformationIcon from '$lib/icons/InformationIcon.svelte';
    import { nanoid } from 'nanoid';

    let futureActions = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    let isOnlyText = $state(true);

    function addAction(id: string) {
        futureActions = [...futureActions, { id: nanoid(), description: '', prominent: false, daily: false }];
    }

    function removeAction(id: string) {
        if (futureActions[futureActions.length - 1].id !== id && futureActions.find(e => e.id === id)?.description !== '') {
            futureActions = futureActions.filter(e => e.id !== id);
        }
    }

    function toggleProminent(id: string) {
        futureActions = futureActions.map(e => 
            e.id === id ? { ...e, prominent: !e.prominent } : e
        );
    }

    function toggleDaily(id: string) {
        futureActions = futureActions.map(e => 
            e.id === id ? { ...e, daily: !e.daily } : e
        );
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <!-- <Future styleTw="size-6 text-alineados-gray-900" /> -->
        <h2 class="text-2xl font-medium text-alineados-gray-900">Acciones Futuro - Corto plazo</h2>
        <Tooltip
            open={false}
            messages={[
                'Acciones planificadas para el corto plazo',
                'Define acciones concretas y medibles'
            ]}
        >
            <InformationIcon styleTw="size-4" />
        </Tooltip>
    </div>
    <div class="-ml-10 mt-5 flex flex-col gap-2">
        {#each futureActions as action}
            <Item
                deleteItem={() => removeAction(action.id)}
                addItem={() => addAction(action.id)}
                prominentItem={() => toggleProminent(action.id)}
                dailyItem={() => toggleDaily(action.id)}
                onInput={() => {
                    if (futureActions[futureActions.length - 1].description !== '') {
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