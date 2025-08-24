<script lang="ts">
    import { onMount } from 'svelte';
    import { getContext } from 'svelte';
    import type { Relation } from '$lib/interfaces/Relations.interface';
    import { getEndpointByVenv } from '$lib/services/endpoints';

    export let relation: Relation;
    let range = $state<'week' | 'month' | 'semester' | 'year'>('month');
    let items: Array<{ date: string; label: string; notes?: string; location?: string }> = $state([]);
    let loading = $state(false);

    const token = getContext<string>('token') || '';
    const host = getEndpointByVenv().pillars;

    async function load() {
        loading = true;
        const now = new Date();
        let from = new Date(now);
        switch (range) {
            case 'week': from.setDate(now.getDate() - 7); break;
            case 'month': from.setMonth(now.getMonth() - 1); break;
            case 'semester': from.setMonth(now.getMonth() - 6); break;
            case 'year': from.setFullYear(now.getFullYear() - 1); break;
        }
        const params = new URLSearchParams({
            uid: relation.uid,
            relation_id: relation.id,
            date_from: from.toISOString(),
        });
        const res = await fetch(`${host}/api/v1/gatherings/?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) {
            items = (data?.data?.gatherings || []).map((g: any) => ({ date: g.date, label: g.notes || '', location: g.location }));
        }
        loading = false;
    }

    onMount(load);
    $effect(load);
</script>

<div class="rounded-xl border border-gray-200 bg-white py-4 px-6 mt-8">
    <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-medium">Encuentros</h3>
        <select bind:value={range} class="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-alineados-green-500 focus:outline-none focus:ring-2 focus:ring-alineados-green-200">
            <option value="week">Semana</option>
            <option value="month">Mes</option>
            <option value="semester">Semestre</option>
            <option value="year">Año</option>
        </select>
    </div>
    {#if loading}
        <div class="text-sm text-gray-500">Cargando...</div>
    {:else if items.length === 0}
        <div class="text-sm text-gray-500">Sin encuentros en el período seleccionado.</div>
    {:else}
        <table class="w-full text-sm">
            <thead>
                <tr class="text-left text-gray-500">
                    <th class="py-2">Fecha</th>
                    <th class="py-2">Notas</th>
                    <th class="py-2">Lugar</th>
                </tr>
            </thead>
            <tbody>
                {#each items as it}
                    <tr class="border-t">
                        <td class="py-2">{new Date(it.date).toLocaleString()}</td>
                        <td class="py-2">{it.label}</td>
                        <td class="py-2">{it.location}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</div>


