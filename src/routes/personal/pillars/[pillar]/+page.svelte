<script lang="ts">
    import type { PageData } from './$types';
    import PillarHeader from '$lib/modules/personal/pillars/PillarHeader.svelte';
    import ElementsSection from '$lib/modules/personal/pillars/ElementsSection.svelte';
    import ObjectivesSection from '$lib/modules/personal/pillars/ObjectivesSection.svelte';
    import PastActionsSection from '$lib/modules/personal/pillars/PastActionsSection.svelte';
    import HabitsSection from '$lib/modules/personal/pillars/HabitsSection.svelte';
    import FutureActionsSection from '$lib/modules/personal/pillars/FutureActionsSection.svelte';
    import { pillarState } from '$lib/stores';
	import MediumTermActionsSection from '$lib/modules/personal/pillars/MediumTermActionsSection.svelte';
	import LongTermActionsSection from '$lib/modules/personal/pillars/LongTermActionsSection.svelte';

    export let data: PageData;
    
    // Get pillar info from the URL parameter
    const pillarName = data.pillar;
    const pillarInfo = pillarState[pillarName];
</script>

<div class="flex flex-col gap-8">
    <PillarHeader {pillarInfo} />
    
    <div class="px-4 md:px-8 lg:px-16 space-y-12">
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