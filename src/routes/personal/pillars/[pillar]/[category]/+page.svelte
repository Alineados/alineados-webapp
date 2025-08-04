<script lang="ts">
    import ElementsSection from '$lib/modules/personal/pillars/ElementsSection.svelte';
    import ObjectivesSection from '$lib/modules/personal/pillars/ObjectivesSection.svelte';
    import PastActionsSection from '$lib/modules/personal/pillars/PastActionsSection.svelte';
    import HabitsSection from '$lib/modules/personal/pillars/HabitsSection.svelte';
    import FutureActionsSection from '$lib/modules/personal/pillars/FutureActionsSection.svelte';
    import MediumTermActionsSection from '$lib/modules/personal/pillars/MediumTermActionsSection.svelte';
    import LongTermActionsSection from '$lib/modules/personal/pillars/LongTermActionsSection.svelte';
    import PillarSidebar from '$lib/modules/personal/pillars/PillarSidebar.svelte';
    import PillarHeader from '$lib/modules/personal/pillars/PillarHeader.svelte';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let pillar = $derived($page.params.pillar);
    let category = $derived($page.params.category);
    let isLoaded = $state(false);

    onMount(() => {
        setTimeout(() => {
            isLoaded = true;
        }, 100);
    });
</script>

{#if isLoaded}
    <div class="flex min-h-screen flex-col">
        <PillarHeader {category} pillarInfo={{
            id: '',
            name: pillar,
            label: pillar,
            categories: []
        }} />

        <div class="flex flex-1 px-4 md:px-8 lg:px-16">
            <div class="flex-1 space-y-12 mt-8">

                <div class="space-y-12">
                    <ElementsSection />
                    <ObjectivesSection />
                    <div class="space-y-8">
                        <PastActionsSection type="positive" />
                        <PastActionsSection type="improve" />
                    </div>
                    <HabitsSection />
                    <div class="space-y-8">
                        <FutureActionsSection />
                        <MediumTermActionsSection />
                        <LongTermActionsSection />
                    </div>
                </div>
            </div>

            <div class="w-[400px] bg-white p-6">
                <PillarSidebar />
            </div>
        </div>
    </div>
{/if}