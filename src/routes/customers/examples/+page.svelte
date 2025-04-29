<script lang="ts">
    import { page } from '$app/stores';
    import Check from 'lucide-svelte/icons/check';
    import Eye from 'lucide-svelte/icons/eye';
    import Video from 'lucide-svelte/icons/video';

    const sections = [
        {
            title: 'Personal - Acciones',
            examples: [
                { title: 'Sobreviví a un volcan', type: 'video' },
                { title: 'Sobreviví a una torbonada', type: 'video' }
            ]
        },
        {
            title: 'Personal - Pensamientos',
            examples: [
                { title: 'Sobreviví a un volcan', type: 'video' },
                { title: 'Sobreviví a una torbonada', type: 'video' }
            ]
        },
        {
            title: 'Personal - Relatos',
            examples: [
                { title: 'Sobreviví a un volcan', type: 'video' },
                { title: 'Sobreviví a una torbonada', type: 'video' }
            ]
        }
    ];
</script>

<div class="container mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <p class="mb-2 flex items-center gap-1 text-sm font-medium text-alineados-gray-600">
        <span>Apoyo a usuarios</span>
        <span>/</span>
        <span>Ejemplos</span>
    </p>

    <!-- Title -->
    <h1 class="mb-8 text-5xl font-bold text-alineados-gray-900">Ejemplos</h1>

    <!-- Sections -->
    {#each sections as section}
        <div class="mb-12">
            <h2 class="mb-6 text-2xl font-semibold text-alineados-gray-900">{section.title}</h2>
            <div class="grid grid-cols-2 gap-6">
                {#each section.examples as example}
                    <div class="overflow-hidden rounded-2xl bg-white border border-gray-200">
                        <div class="relative aspect-[2/1] bg-alineados-blue-900 p-4">
                            <Check class="absolute right-4 top-4 h-6 w-6 text-alineados-green-500" />
                        </div>
                        <div class="border-t border-gray-200">
                            <div class="p-4">
                                <h3 class="mb-4 text-base font-medium text-alineados-gray-900">{example.title}</h3>
                                <div class="flex gap-2">
                                    <button class="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5">
                                        <Eye class="h-4 w-4 text-gray-600" />
                                        <span class="text-xs text-gray-600">Ver</span>
                                    </button>
                                    <button class="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5">
                                        <Video class="h-4 w-4 text-gray-600" />
                                        <span class="text-xs text-gray-600">Video</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>