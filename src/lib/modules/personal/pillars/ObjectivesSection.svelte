<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    // import Target from '$lib/icons/Target.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import InformationIcon from '$lib/icons/InformationIcon.svelte';
    import { nanoid } from 'nanoid';

    let objectives = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    let isOnlyText = $state(true);

    function addObjective(id: string) {
        objectives = [...objectives, { id: nanoid(), description: '', prominent: false, daily: false }];
    }

    function removeObjective(id: string) {
        if (objectives[objectives.length - 1].id !== id && objectives.find(e => e.id === id)?.description !== '') {
            objectives = objectives.filter(e => e.id !== id);
        }
    }

    function toggleProminent(id: string) {
        objectives = objectives.map(e => 
            e.id === id ? { ...e, prominent: !e.prominent } : e
        );
    }

    function toggleDaily(id: string) {
        objectives = objectives.map(e => 
            e.id === id ? { ...e, daily: !e.daily } : e
        );
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <!-- <Target styleTw="size-6 text-alineados-gray-900" /> -->
        <h2 class="text-2xl font-medium text-alineados-gray-900">Objetivos</h2>
        <Tooltip
            open={false}
            messages={[
                'Lista de objetivos para este pilar',
                'Cada objetivo debe ser específico y medible'
            ]}
        >
            <InformationIcon styleTw="size-4" />
        </Tooltip>
    </div>
    <div class="-ml-10 mt-5 flex flex-col gap-2">
        {#each objectives as objective}
            <Item
                deleteItem={() => removeObjective(objective.id)}
                addItem={() => addObjective(objective.id)}
                prominentItem={() => toggleProminent(objective.id)}
                dailyItem={() => toggleDaily(objective.id)}
                onInput={() => {
                    if (objectives[objectives.length - 1].description !== '') {
                        addObjective(objective.id);
                    }
                    if (objective.description === '') {
                        removeObjective(objective.id);
                    }
                }}
                bind:isOnlyText
                bind:isDaily={objective.daily}
                bind:isStarred={objective.prominent}
                bind:value={objective.description}
            />
        {/each}
    </div>
</div>
