<script lang="ts">
    import ImagesCarousel from '$lib/components/ImagesCarousel.svelte';
    import Star from 'lucide-svelte/icons/star';
    import { nanoid } from 'nanoid';
    import PillarDocuments from './PillarDocuments.svelte';

    let priority = $state(0);
    let mood = $state<'happy' | 'neutral' | 'sad'>('neutral');
    
    let associatedProblems = $state([
        { id: nanoid(), name: 'Problema 1 - Pharetra tincidunt lacus' },
        { id: nanoid(), name: 'Problema 2 - Pharetra tincidunt lacus' },
        { id: nanoid(), name: 'Problema 3 - Pharetra tincidunt lacus' }
    ]);

    function setPriority(value: number) {
        priority = value;
    }

    function setMood(value: 'happy' | 'neutral' | 'sad') {
        mood = value;
    }
</script>

<div class="w-80 space-y-8">
    <div>
        <h3 class="mb-4 text-lg font-medium">Recuerdos</h3>
        <ImagesCarousel />
    </div>

    <div>
        <h3 class="mb-4 text-lg font-medium">Prioridad</h3>
        <div class="flex gap-1">
            {#each Array(3) as _, i}
                <button 
                    class="transition-colors"
                    onclick={() => setPriority(i + 1)}
                >
                    <Star 
                        class="h-8 w-8 {i < priority ? 'text-yellow-400' : 'text-alineados-gray-200'}"
                    />
                </button>
            {/each}
        </div>
    </div>

    <div>
        <h3 class="mb-4 text-lg font-medium">Estado</h3>
        <div class="flex gap-4">
            <button 
                class="rounded-full p-2 transition-colors hover:bg-alineados-gray-100 {mood === 'happy' ? 'bg-alineados-gray-100' : ''}"
                onclick={() => setMood('happy')}
            >
                <span class="text-2xl">😊</span>
            </button>
            <button 
                class="rounded-full p-2 transition-colors hover:bg-alineados-gray-100 {mood === 'neutral' ? 'bg-alineados-gray-100' : ''}"
                onclick={() => setMood('neutral')}
            >
                <span class="text-2xl">😐</span>
            </button>
            <button 
                class="rounded-full p-2 transition-colors hover:bg-alineados-gray-100 {mood === 'sad' ? 'bg-alineados-gray-100' : ''}"
                onclick={() => setMood('sad')}
            >
                <span class="text-2xl">☹️</span>
            </button>
        </div>
    </div>

    <div>
        <h3 class="mb-4 text-lg font-medium">Problemas asociados</h3>
        <div class="space-y-2">
            {#each associatedProblems as problem}
                <div class="rounded-lg bg-white p-3 shadow">
                    <p class="text-sm text-alineados-gray-900">{problem.name}</p>
                </div>
            {/each}
        </div>
    </div>

    <div>
        <h3 class="mb-4 text-lg font-medium">Archivos adjuntos</h3>
        <PillarDocuments />
    </div>
</div>