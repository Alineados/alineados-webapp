<script lang="ts">
    import type { DataPillar } from '$lib/interfaces';
    import { goto } from '$app/navigation';

    let { pillarInfo }: { pillarInfo: DataPillar } = $props();

    function handleGoBack() {
        goto('/personal/pillars');
    }
</script>

<div class="flex flex-col gap-6 px-4 md:px-8 lg:px-16 pb-6">
    <p class="flex flex-row text-sm font-medium text-alineados-gray-600">
        <button 
            onclick={() => goto('/personal')}
            class="text-alineados-gray-600 hover:underline"
        >
            Personal
        </button>
        <span class="mx-1">/</span>
        <button
            onclick={handleGoBack}
            class="text-alineados-gray-600 hover:underline"
        >
            Mis Pilares de Vida
        </button>
        <span class="mx-1">/</span>
        <span class="text-alineados-orange-900">{pillarInfo.label}</span>
    </p>

    <div class="flex flex-col gap-5 border-b border-alineados-gray-200 pb-6 lg:flex-row lg:justify-between">
        <p class="text-5xl font-bold text-alineados-blue-900">{pillarInfo.label}</p>
    </div>
</div>