<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    import Cube from '$lib/icons/Cube.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import InformationIcon from '$lib/icons/InformationIcon.svelte';
    import { nanoid } from 'nanoid';

    let elements = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    let isOnlyText = $state(true);

    function addElement(id: string) {
        elements = [...elements, { id: nanoid(), description: '', prominent: false, daily: false }];
    }

    function removeElement(id: string) {
        if (elements[elements.length - 1].id !== id && elements.find(e => e.id === id)?.description !== '') {
            elements = elements.filter(e => e.id !== id);
        }
    }

    function toggleProminent(id: string) {
        elements = elements.map(e => 
            e.id === id ? { ...e, prominent: !e.prominent } : e
        );
    }

    function toggleDaily(id: string) {
        elements = elements.map(e => 
            e.id === id ? { ...e, daily: !e.daily } : e
        );
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <Cube styleTw="size-6 text-alineados-gray-900" />
        <h2 class="text-2xl font-medium text-alineados-gray-900">Elementos</h2>
        <Tooltip
            open={false}
            messages={[
                'Lista de elementos importantes para este pilar',
                'Cada elemento debe ser conciso y específico'
            ]}
        >
            <InformationIcon styleTw="size-4" />
        </Tooltip>
    </div>
    <div class="-ml-10 mt-5 flex flex-col gap-2">
        {#each elements as element}
            <Item
                deleteItem={() => removeElement(element.id)}
                addItem={() => addElement(element.id)}
                prominentItem={() => toggleProminent(element.id)}
                dailyItem={() => toggleDaily(element.id)}
                onInput={() => {
                    if (elements[elements.length - 1].description !== '') {
                        addElement(element.id);
                    }
                    if (element.description === '') {
                        removeElement(element.id);
                    }
                }}
                bind:isOnlyText
                bind:isDaily={element.daily}
                bind:isStarred={element.prominent}
                bind:value={element.description}
            />
        {/each}
    </div>
</div>