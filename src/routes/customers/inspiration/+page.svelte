<script lang="ts">
    import { page } from '$app/stores';
    // import VideoCamera from 'lucide-svelte/icons/video-camera';
    import Mic from 'lucide-svelte/icons/mic';
    import Image from 'lucide-svelte/icons/image';
    import MessageSquare from 'lucide-svelte/icons/message-square';
    import Clock from 'lucide-svelte/icons/clock';
    import Star from 'lucide-svelte/icons/star';

    let activeTab = $state('Todos');
    let showFeatured = $state(true);

    const tabs = ['Todos', 'Categoría', 'Fin'];
    const mediaTypes = [
        { icon: MessageSquare, label: 'Textos' },
        { icon: MessageSquare, label: 'Videos' },
        { icon: Mic, label: 'Audio' },
        { icon: Image, label: 'Fotos' },
    ];

    const inspirationCards = Array(6).fill({
        title: 'Como dejar de procrastinar',
        image: '/path/to/wave-image.jpg',
        category: 'Salud',
        type: 'Éxito',
        duration: '7 min'
    });
</script>

<div class="container mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <p class="mb-2 flex items-center gap-1 text-sm font-medium text-alineados-gray-600">
        <span>Apoyo a usuarios</span>
        <span>/</span>
        <span>Inspiración</span>
    </p>

    <!-- Title -->
    <h1 class="mb-8 text-5xl font-bold text-alineados-gray-900">Inspiración</h1>

    <!-- Filters -->
    <div class="mb-8 flex items-center justify-between">
        <div class="flex gap-2">
            {#each tabs as tab}
                <button 
                    class="rounded-full px-4 py-2 text-sm font-medium {activeTab === tab ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}"
                    on:click={() => activeTab = tab}
                >
                    {tab}
                </button>
            {/each}
        </div>

        <!-- Featured toggle -->
        <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Destacado</span>
            <button 
                class="relative h-6 w-11 rounded-full bg-gray-200 transition-colors {showFeatured ? 'bg-green-500' : ''}"
                on:click={() => showFeatured = !showFeatured}
            >
                <span class="absolute left-1 top-1 h-4 w-4 transform rounded-full bg-white transition-transform {showFeatured ? 'translate-x-5' : ''}" />
            </button>
        </div>
    </div>

    <!-- Media type selector -->
    <div class="mb-8 flex justify-center gap-16">
        {#each mediaTypes as { icon: Icon, label }}
            <div class="flex flex-col items-center gap-4">
                <div class="rounded-full bg-green-100 p-4">
                    <Icon class="h-8 w-8 text-green-700" />
                </div>
                <span class="text-lg font-medium text-alineados-gray-900">{label}</span>
            </div>
        {/each}
    </div>

    <!-- Content grid -->
    <div class="grid grid-cols-3 gap-6">
        {#each inspirationCards as card}
            <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div class="relative">
                    <img 
                        src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
                        alt="Wave"
                        class="aspect-video w-full object-cover"
                    />
                    <button class="absolute right-2 top-2">
                        <Star class="h-6 w-6 text-yellow-400" />
                    </button>
                </div>
                <div class="p-4">
                    <h3 class="mb-4 text-lg font-medium text-alineados-gray-900">{card.title}</h3>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <div class="h-5 w-5 rounded-full bg-gray-200" />
                            <span class="text-sm text-gray-600">{card.category}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="h-5 w-5 rounded-full bg-gray-200" />
                            <span class="text-sm text-gray-600">{card.type}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Clock class="h-5 w-5 text-gray-400" />
                            <span class="text-sm text-gray-600">{card.duration}</span>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>