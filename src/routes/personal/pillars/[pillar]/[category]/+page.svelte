<script lang="ts">
    import type { PageData } from './$types';
    import PillarHeader from '$lib/modules/personal/pillars/PillarHeader.svelte';
    import PillarSidebar from '$lib/modules/personal/pillars/PillarSidebar.svelte';
    import ElementsSection from '$lib/modules/personal/pillars/ElementsSection.svelte';
    import ObjectivesSection from '$lib/modules/personal/pillars/ObjectivesSection.svelte';
    import PastActionsSection from '$lib/modules/personal/pillars/PastActionsSection.svelte';
    import HabitsSection from '$lib/modules/personal/pillars/HabitsSection.svelte';
    import FutureActionsSection from '$lib/modules/personal/pillars/FutureActionsSection.svelte';
    import MediumTermActionsSection from '$lib/modules/personal/pillars/MediumTermActionsSection.svelte';
    import LongTermActionsSection from '$lib/modules/personal/pillars/LongTermActionsSection.svelte';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { userState, saveSynchronously, currentCategoryInfo } from '$lib/stores';
    import { get } from 'svelte/store';
    import { browser } from '$app/environment';
    import { getContext } from 'svelte';
    import { ensureCategoryInitialized } from '$lib/stores/pillar/category';

    let { data } = $props<{ data: PageData }>();

    let pillar = $derived($page.params.pillar || '');
    let category = $derived($page.params.category || '');
    let isLoaded = $state(false);

    // Obtener el token del contexto
    const token = getContext<string>('token');

    onMount(() => {
        // Primero hacer visible la UI
        setTimeout(() => {
            isLoaded = true;
        }, 100);

        // *** INICIALIZACIÓN GLOBAL DE CATEGORÍA ***
        // DELAY para permitir que las secciones intenten cargar datos primero
        setTimeout(async () => {
            console.log(`🎯 Delayed initialization check for category: ${category}`);
            console.log(`🎯 Pillar: ${pillar}`);
            
            // Solo inicializar si NO hay datos en el store
            const currentInfo = get(currentCategoryInfo);
            if (!currentInfo || !currentInfo.id) {
                console.log(`🎯 No data found in store, proceeding with initialization`);
                await ensureCategoryInitialized(category);
                console.log(`✅ Category ${category} globally initialized`);
            } else {
                console.log(`✅ Category ${category} already has data, skipping initialization`);
            }
        }, 500); // 500ms delay para que las secciones carguen primero

        // Store page parameters for autosave function
        if (browser) {
            localStorage.setItem('pageParams', JSON.stringify({
                pillar: pillar,
                category: category
            }));
            localStorage.setItem('userState', JSON.stringify({
                id: userState.id
            }));
            localStorage.setItem('token', token || '');
        }

        // Handle beforeunload to save synchronously
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
            
            // Save synchronously before leaving
            saveSynchronously();
            
            return 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
        };

        // Add event listeners
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pagehide', handleBeforeUnload);
        window.addEventListener('unload', handleBeforeUnload);

        // Cleanup
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('pagehide', handleBeforeUnload);
            window.removeEventListener('unload', handleBeforeUnload);
        };
    });
</script>

{#if isLoaded}
    <div class="flex min-h-screen flex-col">
        <PillarHeader category={category} pillarInfo={{
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
                <PillarSidebar 
                    categoryData={data.categoryData}
                    pillarType={data.pillarType}
                />
            </div>
        </div>
    </div>
{/if}