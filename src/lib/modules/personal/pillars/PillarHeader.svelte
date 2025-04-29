<script lang="ts">
    import Lock from '$lib/icons/Lock.svelte';
    import Eye from '$lib/icons/Eye.svelte';
    // import DotsVertical from '$lib/icons/DotsVertical.svelte';
    import type { DataPillar } from '$lib/interfaces';

    let { 
        pillarInfo,
        category 
    }: { 
        pillarInfo: DataPillar;
        category: string;
    } = $props();
    
    let isActive = $state(true);
</script>

<div class="border-b bg-white">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
            <div class="flex items-center gap-2">
                <h1 class="text-2xl font-bold text-alineados-gray-900 capitalize">{category}</h1>
                <div class="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5">
                    <Lock class="size-4 text-green-700" />
                    <span class="text-xs font-medium text-green-700">Activo</span>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <button class="btn-secondary">
                    <Eye class="size-5" />
                    <span>Ver</span>
                </button>
                <button class="btn-primary">
                    <span>Rendir Cuentas</span>
                </button>
                <button class="rounded-full p-2 hover:bg-alineados-gray-100">
                    <!-- <DotsVertical class="size-5 text-alineados-gray-600" /> -->
                </button>
            </div>
        </div>
    </div>
</div>