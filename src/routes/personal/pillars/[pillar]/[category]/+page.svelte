<script lang="ts">
    import ElementsSection from '$lib/modules/personal/pillars/ElementsSection.svelte';
    import ObjectivesSection from '$lib/modules/personal/pillars/ObjectivesSection.svelte';
    import PastActionsSection from '$lib/modules/personal/pillars/PastActionsSection.svelte';
    import HabitsSection from '$lib/modules/personal/pillars/HabitsSection.svelte';
    import FutureActionsSection from '$lib/modules/personal/pillars/FutureActionsSection.svelte';
    import MediumTermActionsSection from '$lib/modules/personal/pillars/MediumTermActionsSection.svelte';
    import LongTermActionsSection from '$lib/modules/personal/pillars/LongTermActionsSection.svelte';
    import { page } from '$app/stores';

    // Get pillar and category from URL parameters
    $: pillar = $page.params.pillar;
    $: category = $page.params.category;
</script>

<div class="flex flex-col gap-8 px-4 md:px-8 lg:px-16">
    <div class="flex flex-col gap-6 pt-6">
        <p class="flex flex-row text-sm font-medium text-alineados-gray-600">
            <a href="/personal" class="hover:underline">Personal</a>
            <span class="mx-1">/</span>
            <a href="/personal/pillars" class="hover:underline">Mis Pilares de Vida</a>
            <span class="mx-1">/</span>
            <span class="capitalize">{category}</span>
        </p>
        <h1 class="text-4xl font-bold text-alineados-blue-900 capitalize">{category}</h1>
    </div>

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