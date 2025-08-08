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
    import { ensureCategoryInitialized, currentCategoryActive, globalRequiredFieldsComplete, showRequiredFieldsMessage } from '$lib/stores/pillar/category';

    let { data } = $props<{ data: PageData }>();

    let pillar = $derived($page.params.pillar || '');
    let category = $derived($page.params.category || '');
    let isLoaded = $state(false);

    // Función para manejar clics en contenido deshabilitado
    function handleDisabledClick() {
        if (!$globalRequiredFieldsComplete) {
            showRequiredFieldsMessage.set(true);
            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                showRequiredFieldsMessage.set(false);
            }, 3000);
        }
    }

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
            // Guardar los datos de la página para acceso global
            localStorage.setItem('pageData', JSON.stringify({
                categoryData: data.categoryData,
                pillarType: data.pillarType
            }));
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
        
        <!-- Mensaje Toast para campos requeridos -->
        {#if $showRequiredFieldsMessage}
            <div class="fixed top-4 right-4 z-50 max-w-sm">
                <div class="bg-orange-500 text-white px-6 py-4 rounded-lg shadow-lg border-l-4 border-orange-600">
                    <div class="flex items-center">
                        <svg class="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                        <div>
                            <p class="font-medium">Campos obligatorios</p>
                            <p class="text-sm opacity-90">Primero selecciona la prioridad y estado en el panel lateral</p>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
        
        <div class="flex flex-1 px-4 md:px-8 lg:px-16">
            <div class="flex-1 space-y-12 mt-8">

                <div 
                    class="space-y-12 {!$globalRequiredFieldsComplete ? 'opacity-50 pointer-events-none' : ''}"
                    on:click={handleDisabledClick}
                    on:keydown={handleDisabledClick}
                >
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
                    associatedProblems={data.associatedProblems}
                />
            </div>
        </div>
    </div>
{/if}