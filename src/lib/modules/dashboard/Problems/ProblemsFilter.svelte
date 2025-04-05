<script lang="ts">
    import CardFilter from '$lib/components/CardFilter.svelte';
    import SelectablePill from '$lib/components/SelectablePill.svelte';
    import ChevronLeft from '$lib/icons/ChevronLeft.svelte';
    import ChevronRight from '$lib/icons/ChevronRight.svelte';
    import {
        healthProblems,
        relationalProblems,
        spiritualProblems,
        vocationalProblems,
        problemCard
    } from '$lib/stores';
    import { onMount, tick } from 'svelte';

    let { pillar_name, pid }: { pillar_name: keyof typeof cardFilter; pid: string } = $props();

    // Filter items object state
    let cardFilter = $state<{
        health: boolean;
        relational: boolean;
        vocational: boolean;
        spiritual: boolean;
    }>({
        health: false,
        relational: false,
        vocational: false,
        spiritual: false
    });

    let initialized = $state(false);
    let dataLoaded = $state(false);
    let contentReady = $state(false);

    function changeFilter(filter: keyof typeof cardFilter) {
        cardFilter.health = false;
        cardFilter.relational = false;
        cardFilter.vocational = false;
        cardFilter.spiritual = false;
    
        cardFilter[filter] = true;
        
        // Reset scroll position when changing filters
        if (scrollContainer) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
            checkScrollability();
        }
    }
    


    let scrollContainer: HTMLDivElement;
    let showLeftChevron = $state(false);
    let showRightChevron = $state(false);

    // Inicialización asíncrona de los filtros
    async function initializeFilters() {
        if (!pillar_name || initialized) return;
        
        await tick();
        changeFilter(pillar_name);
        initialized = true;
        
        await tick();
        if (scrollContainer) {
            checkScrollability();
        }
    }

    // Efecto para verificar si los datos están cargados
    $effect(() => {
        const hasProblems = $healthProblems.length > 0 || 
                         $relationalProblems.length > 0 || 
                         $vocationalProblems.length > 0 || 
                         $spiritualProblems.length > 0;
        
        const hasCurrentProblem = $problemCard && Object.keys($problemCard).length > 0;
        
        dataLoaded = hasProblems && hasCurrentProblem;
        
        if (dataLoaded && !initialized) {
            initializeFilters();
        }
    });

    // Efecto para asegurar que el contenido esté listo
    $effect(() => {
        if (initialized && dataLoaded) {
            contentReady = true;
        }
    });

    function checkScrollability() {
        if (!scrollContainer) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        showLeftChevron = scrollLeft > 0;
        showRightChevron = Math.ceil(scrollLeft + clientWidth) < scrollWidth;
    }

    function checkScroll() {
        checkScrollability();
    }

    function scroll(direction: 'left' | 'right') {
        if (!scrollContainer) return;
        const scrollAmount = direction === 'left' ? -200 : 200;
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    // Inicialización en el montaje del componente
    onMount(async () => {
        await initializeFilters();
        
        if (scrollContainer) {
            const resizeObserver = new ResizeObserver(() => {
                checkScrollability();
            });
            
            resizeObserver.observe(scrollContainer);
            checkScrollability();

            return () => {
                resizeObserver.disconnect();
            };
        }
    });
</script>

<div class="mt-4 flex flex-col gap-3 px-4 md:px-8 lg:px-16 relative z-10 bg-white">
    {#if contentReady}
        <div class="flex flex-row gap-2">
            {#if $healthProblems.length > 0}
                <CardFilter
                    type="complex"
                    text="Salud"
                    bind:selected={cardFilter.health}
                    triggerFunction={() => changeFilter('health')}
                />
            {/if}
            {#if $relationalProblems.length > 0}
                <CardFilter
                    type="complex"
                    text="Relación"
                    bind:selected={cardFilter.relational}
                    triggerFunction={() => changeFilter('relational')}
                />
            {/if}
            {#if $vocationalProblems.length > 0}
                <CardFilter
                    type="complex"
                    text="Vocación"
                    bind:selected={cardFilter.vocational}
                    triggerFunction={() => changeFilter('vocational')}
                />
            {/if}
            {#if $spiritualProblems.length > 0}
                <CardFilter
                    type="complex"
                    text="Espiritualidad"
                    bind:selected={cardFilter.spiritual}
                    triggerFunction={() => changeFilter('spiritual')}
                />
            {/if}
        </div>

        <div class="relative flex w-full items-center gap-2">
            {#if showLeftChevron}
                <button
                    onclick={() => scroll('left')}
                    class="flex h-8 items-center justify-center hover:text-alineados-gray-600"
                >
                    <ChevronLeft styleTw="h-6 w-6 text-alineados-gray-400" />
                </button>
            {/if}

            <div class="relative max-w-[1000px] w-full">
                <div
                    bind:this={scrollContainer}
                    onscroll={checkScrollability}
                    class="flex overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
                >
                    <div class="flex flex-nowrap gap-2">
                        {#if cardFilter.health}
                            {#each [...$healthProblems].reverse() as health}
                                <div class="flex-none">
                                    {#if health.id === pid}
                                        <SelectablePill
                                            isLink={true}
                                            pid={health.id}
                                            name="health"
                                            selected={true}
                                            bind:text={$problemCard.problem_name}
                                            maxWidth="200px"
                                        />
                                    {:else}
                                        <SelectablePill
                                            isLink={true}
                                            pid={health.id}
                                            name="health"
                                            selected={false}
                                            text={health.problem_name}
                                            maxWidth="200px"
                                        />
                                    {/if}
                                </div>
                            {/each}
                        {/if}

                        {#if cardFilter.relational}
                            {#each [...$relationalProblems].reverse() as relational}
                                <div class="flex-none">
                                    {#if relational.id === pid}
                                        <SelectablePill
                                            isLink={true}
                                            pid={relational.id}
                                            name="relational"
                                            selected={true}
                                            bind:text={$problemCard.problem_name}
                                            maxWidth="200px"
                                        />
                                    {:else}
                                        <SelectablePill
                                            isLink={true}
                                            pid={relational.id}
                                            name="relational"
                                            selected={false}
                                            text={relational.problem_name}
                                            maxWidth="200px"
                                        />
                                    {/if}
                                </div>
                            {/each}
                        {/if}

                        {#if cardFilter.vocational}
                            {#each [...$vocationalProblems].reverse() as vocational}
                                <div class="flex-none">
                                    {#if vocational.id === pid}
                                        <SelectablePill
                                            isLink={true}
                                            pid={vocational.id}
                                            name="vocational"
                                            selected={true}
                                            bind:text={$problemCard.problem_name}
                                            maxWidth="200px"
                                        />
                                    {:else}
                                        <SelectablePill
                                            isLink={true}
                                            pid={vocational.id}
                                            name="vocational"
                                            selected={false}
                                            text={vocational.problem_name}
                                            maxWidth="200px"
                                        />
                                    {/if}
                                </div>
                            {/each}
                        {/if}

                        {#if cardFilter.spiritual}
                            {#each [...$spiritualProblems].reverse() as spiritual}
                                <div class="flex-none">
                                    {#if spiritual.id === pid}
                                        <SelectablePill
                                            isLink={true}
                                            pid={spiritual.id}
                                            name="spiritual"
                                            selected={true}
                                            bind:text={$problemCard.problem_name}
                                            maxWidth="200px"
                                        />
                                    {:else}
                                        <SelectablePill
                                            isLink={true}
                                            pid={spiritual.id}
                                            name="spiritual"
                                            selected={false}
                                            text={spiritual.problem_name}
                                            maxWidth="200px"
                                        />
                                    {/if}
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>

            {#if showRightChevron}
                <button
                    onclick={() => scroll('right')}
                    class="flex h-8 items-center justify-center hover:text-alineados-gray-600"
                >
                    <ChevronRight styleTw="h-6 w-6 text-alineados-gray-400" />
                </button>
            {/if}
        </div>
    {/if}
</div>
