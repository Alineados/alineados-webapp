<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    import Repeat from '$lib/icons/Repeat.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import InformationIcon from '$lib/icons/InformationIcon.svelte';
    import { nanoid } from 'nanoid';

    let habits = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    let isOnlyText = $state(true);

    function addHabit(id: string) {
        habits = [...habits, { id: nanoid(), description: '', prominent: false, daily: false }];
    }

    function removeHabit(id: string) {
        if (habits[habits.length - 1].id !== id && habits.find(e => e.id === id)?.description !== '') {
            habits = habits.filter(e => e.id !== id);
        }
    }

    function toggleProminent(id: string) {
        habits = habits.map(e => 
            e.id === id ? { ...e, prominent: !e.prominent } : e
        );
    }

    function toggleDaily(id: string) {
        habits = habits.map(e => 
            e.id === id ? { ...e, daily: !e.daily } : e
        );
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <Repeat styleTw="size-6 text-alineados-gray-900" />
        <h2 class="text-2xl font-medium text-alineados-gray-900">Hábitos</h2>
        <Tooltip
            open={false}
            messages={[
                'Lista de hábitos para fortalecer este pilar',
                'Enfócate en hábitos específicos y medibles'
            ]}
        >
            <InformationIcon styleTw="size-4" />
        </Tooltip>
    </div>
    <div class="-ml-10 mt-5 flex flex-col gap-2">
        {#each habits as habit}
            <Item
                deleteItem={() => removeHabit(habit.id)}
                addItem={() => addHabit(habit.id)}
                prominentItem={() => toggleProminent(habit.id)}
                dailyItem={() => toggleDaily(habit.id)}
                onInput={() => {
                    if (habits[habits.length - 1].description !== '') {
                        addHabit(habit.id);
                    }
                    if (habit.description === '') {
                        removeHabit(habit.id);
                    }
                }}
                bind:isOnlyText
                bind:isDaily={habit.daily}
                bind:isStarred={habit.prominent}
                bind:value={habit.description}
            />
        {/each}
    </div>
</div>