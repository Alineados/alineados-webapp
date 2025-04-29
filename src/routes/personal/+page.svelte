<script lang="ts">
    import { goto } from '$app/navigation';
    import Loader from '$lib/shared/ui/loader/loader.svelte';

    let isLoading = $state(false);
    let loadingCardHref = $state('');

    async function handleNavigation(href: string) {
        isLoading = true;
        loadingCardHref = href;
        await goto(href);
        isLoading = false;
        loadingCardHref = '';
    }

    const cards = [
        {
            title: 'Acciones',
            icon: 'checklist',
            description: 'Gestiona tus pilares de vida',
            href: '/personal/pillars'
        },
        {
            title: 'Pensamientos',
            icon: 'lightbulb',
            description: 'Registra tus ideas y reflexiones',
            href: '/personal/thoughts'
        },
        {
            title: 'Relatos',
            icon: 'book',
            description: 'Documenta tus experiencias',
            href: '/personal/stories'
        },
        {
            title: 'Situaciones por mejorar',
            icon: 'maze',
            description: 'Identifica áreas de mejora',
            href: '/personal/problems'
        }
    ];
</script>

<div class="container mx-auto px-4 py-8">
    <div class="flex flex-col gap-5 border-b border-alineados-gray-200 pb-6">
        <h1 class="text-5xl font-bold text-alineados-gray-900">Personal</h1>
    </div>
    
    <div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {#each cards as card}
            <button 
                onclick={() => handleNavigation(card.href)}
                class="group relative flex h-64 flex-col items-center justify-center rounded-xl bg-alineados-green-300 p-8 transition-all hover:shadow-lg"
            >
                {#if isLoading && loadingCardHref === card.href}
                    <div class="absolute inset-0 flex items-center justify-center rounded-xl bg-alineados-green-300/90 backdrop-blur-sm">
                        <Loader />
                    </div>
                {/if}

                {#if card.icon === 'checklist'}
                    <div class="mb-6 h-32 w-32 {isLoading && loadingCardHref === card.href ? 'opacity-50' : ''}">
                        <img src="/images/personal/checklist.svg" alt="Checklist icon" class="h-full w-full" />
                    </div>
                {:else if card.icon === 'lightbulb'}
                    <div class="mb-6 h-32 w-32 {isLoading && loadingCardHref === card.href ? 'opacity-50' : ''}">
                        <img src="/images/personal/lightbulb.svg" alt="Lightbulb icon" class="h-full w-full" />
                    </div>
                {:else if card.icon === 'book'}
                    <div class="mb-6 h-32 w-32 {isLoading && loadingCardHref === card.href ? 'opacity-50' : ''}">
                        <img src="/images/personal/book.svg" alt="Book icon" class="h-full w-full" />
                    </div>
                {:else if card.icon === 'maze'}
                    <div class="mb-6 h-32 w-32 {isLoading && loadingCardHref === card.href ? 'opacity-50' : ''}">
                        <img src="/images/personal/maze.svg" alt="Maze icon" class="h-full w-full" />
                    </div>
                {/if}
                
                <h2 class="mb-3 text-2xl font-semibold text-gray-800 {isLoading && loadingCardHref === card.href ? 'opacity-50' : ''}">{card.title}</h2>
                <p class="text-center text-base text-gray-600 {isLoading && loadingCardHref === card.href ? 'opacity-50' : ''}">{card.description}</p>
            </button>
        {/each}
    </div>
</div>