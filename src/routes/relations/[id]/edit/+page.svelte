<script lang="ts">
    import type { PageData } from './$types';
    import RelationHeader from '$lib/components/Relations/RelationHeader.svelte';
    import RelationSidebar from '$lib/components/Relations/RelationSidebar.svelte';
    import PersonalInfoSection from '$lib/components/Relations/sections/PersonalInfoSection.svelte';
    import PositiveQualitiesSection from '$lib/components/Relations/sections/PositiveQualitiesSection.svelte';
    import ImprovementQualitiesSection from '$lib/components/Relations/sections/ImprovementQualitiesSection.svelte';
    import GoalsSection from '$lib/components/Relations/sections/GoalsSection.svelte';
    import ImportantDatesSection from '$lib/components/Relations/sections/ImportantDatesSection.svelte';
    import SocialNetworksSection from '$lib/components/Relations/sections/SocialNetworksSection.svelte';
    import { createEventDispatcher } from 'svelte';

    let { data } = $props<{ data: PageData }>();
    
    const relation = $derived(data.relation);
    const areas = $derived(data.areas);
    const uid = $derived(data.uid);
    const isNew = $derived(data.isNew);

    const dispatch = createEventDispatcher();

    function handleRelationUpdate(event: any) {
        const updatedRelation = event.detail;
        // Aquí puedes implementar la lógica de autosave
        console.log('Relación actualizada:', updatedRelation);
        dispatch('update', updatedRelation);
    }
</script>

<div class="flex min-h-screen flex-col">
    <RelationHeader {relation} isEditing={true} isNew={false} />
    
    <div class="flex flex-1 px-4 md:px-8 lg:px-16">
        <div class="flex-1 space-y-12 mt-8 mr-8">
            <PersonalInfoSection {relation} isEditing={true} />
            <PositiveQualitiesSection {relation} isEditing={true} />
            <ImprovementQualitiesSection {relation} isEditing={true} />
            <GoalsSection {relation} isEditing={true} />
            <ImportantDatesSection {relation} isEditing={true} />
            <SocialNetworksSection {relation} isEditing={true} />
        </div>

        <RelationSidebar {relation} {areas} />
    </div>
</div>
