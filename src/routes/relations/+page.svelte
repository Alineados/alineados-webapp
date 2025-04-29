<script lang="ts">
    import { page } from '$app/stores';
    import Building from 'lucide-svelte/icons/building';
    import GraduationCap from 'lucide-svelte/icons/graduation-cap';
    import Users from 'lucide-svelte/icons/users';
    import ArrowUp from 'lucide-svelte/icons/arrow-up';
    import ArrowDown from 'lucide-svelte/icons/arrow-down';

    let activeTab = $state('Personas');
    let showPercentage = $state(false);

    const tabs = ['Todos', 'Personas', 'Yo a ellos', 'Ellos a mi'];

    const relationStats = {
        total: 32,
        areas: [
            { name: 'Universidad', count: 5, trend: 'down', icon: GraduationCap },
            { name: 'Colegio', count: 34, trend: 'up', icon: Building }
        ]
    };

    const relationTable = [
        { area: 'Familia', personas: 14, yoAEllos: 4, ellosAMi: 5, bien: 5, normal: 10, mal: 10 },
        { area: 'Colegio', personas: 23, yoAEllos: 8, ellosAMi: 15, bien: 5, normal: 10, mal: 10 },
        { area: 'Universidad', personas: 21, yoAEllos: 11, ellosAMi: 10, bien: 5, normal: 10, mal: 10 },
        { area: 'Trabajo', personas: 5, yoAEllos: 1, ellosAMi: 4, bien: 5, normal: 10, mal: 10 },
        { area: 'Otros', personas: 2, yoAEllos: 2, ellosAMi: 0, bien: 5, normal: 10, mal: 10 },
        { area: 'Total', personas: 55, yoAEllos: 26, ellosAMi: 34, bien: 5, normal: 10, mal: 10 }
    ];
</script>

<div class="container mx-auto px-4 py-8">
    <p class="mb-2 text-sm font-medium text-alineados-gray-600">Relaciones</p>
    <h1 class="mb-8 text-5xl font-bold text-alineados-gray-900">Relaciones</h1>

    <!-- Stats Cards -->
    <div class="mb-12 grid grid-cols-3 gap-6">
        <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6">
            <div class="rounded-xl bg-blue-100 p-3">
                <Users class="h-6 w-6 text-blue-600" />
            </div>
            <div>
                <p class="text-sm text-gray-600">Total De Amistades</p>
                <p class="text-3xl font-semibold">{relationStats.total}</p>
            </div>
        </div>

        {#each relationStats.areas as stat}
            <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6">
                <div class="rounded-xl bg-{stat.trend === 'down' ? 'red' : 'green'}-100 p-3">
                    <svelte:component this={stat.icon} class="h-6 w-6 text-{stat.trend === 'down' ? 'red' : 'green'}-600" />
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-600">{stat.name}</p>
                        <div class="flex items-center gap-1 text-{stat.trend === 'down' ? 'red' : 'green'}-600">
                            <svelte:component this={stat.trend === 'down' ? ArrowDown : ArrowUp} class="h-4 w-4" />
                            <span class="text-sm font-medium">{stat.count}</span>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <h2 class="mb-6 text-xl font-semibold">Resumen Total</h2>

    <!-- Tabs -->
    <div class="mb-6 flex items-center justify-between">
        <div class="flex gap-2">
            {#each tabs as tab}
                <button 
                    class="rounded-full px-4 py-2 text-sm font-medium {activeTab === tab ? 'bg-green-900 text-white' : 'text-gray-600 hover:bg-gray-100'}"
                    on:click={() => activeTab = tab}
                >
                    {tab}
                </button>
            {/each}
        </div>

        <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">% Porcentual</span>
            <button 
                class="relative h-6 w-11 rounded-full bg-gray-200 transition-colors {showPercentage ? 'bg-green-500' : ''}"
                on:click={() => showPercentage = !showPercentage}
            >
                <span class="absolute left-1 top-1 h-4 w-4 transform rounded-full bg-white transition-transform {showPercentage ? 'translate-x-5' : ''}" />
            </button>
        </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table class="w-full">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Área</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Personas</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Yo a ellos</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Ellos a mi</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-green-600">Bien</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-yellow-600">Normal</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-red-600">Mal</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                {#each relationTable as row}
                    <tr class="{row.area === 'Total' ? 'bg-gray-50 font-medium' : ''}">
                        <td class="px-6 py-4 text-sm text-gray-900">{row.area}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">{row.personas}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">{row.yoAEllos}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">{row.ellosAMi}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">{row.bien}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">{row.normal}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">{row.mal}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>