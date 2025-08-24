<script lang="ts">
    import { onMount, getContext } from 'svelte';
    import type { Relation } from '$lib/interfaces/Relations.interface';
    import { getEndpointByVenv } from '$lib/services/endpoints';
    import { PhotosService } from '$lib/services/photos/photos';
    
    let { relation }: { relation: Relation } = $props();
    let range = $state<'week' | 'month' | 'semester' | 'year'>('month');
    let items: Array<{ date: string; notes?: string; location?: string; photo_url?: string; display_url?: string }> = $state([]);
    let loading = $state(false);

    const token = getContext<string>('token') || '';
    const host = getEndpointByVenv().pillars;
    
    // Inicializar PhotosService
    let photosService: PhotosService;
    $effect(() => {
        if (token) {
            photosService = PhotosService.getInstance(token);
        }
    });

    async function renewSignedUrl(item: any): Promise<string | undefined> {
        if (!item.photo_url || !photosService) return undefined;
        
        try {
            const renewedUrl = await photosService.getSignedUrl(item.photo_url);
            return renewedUrl;
        } catch (error) {
            console.warn('Could not renew signed URL:', error);
            return item.photo_url; // Fallback to original URL
        }
    }

    async function load() {
        loading = true;
        // Simplify first: fetch by relation only (server filters correctly). We'll add date filters later.
        const params = new URLSearchParams({ uid: relation.uid, relation_id: relation.id });
        const res = await fetch(`${host}/api/v1/gatherings/?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        
        if (res.ok) {
            const gatherings = data?.data?.gatherings || [];
            
            // Procesar cada gathering y renovar signed URLs si es necesario
            const processedItems = await Promise.all(
                gatherings.map(async (g: any) => {
                    const item = {
                        date: g.date || g.created_at || '',
                        notes: g.notes,
                        location: g.location,
                        photo_url: g.photo_url,
                        display_url: g.photo_url
                    };
                    
                    // Si la URL contiene signatura (signed URL), renovarla automáticamente
                    if (g.photo_url && g.photo_url.includes('X-Goog-Signature')) {
                        item.display_url = await renewSignedUrl(item) || g.photo_url;
                    }
                    
                    return item;
                })
            );
            
            items = processedItems;
        }
        loading = false;
    }

    function initLoad(): void { load().then(() => {}); }
    onMount(initLoad);
    $effect(() => { load().then(() => {}); });
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
                    <th class="py-2">Foto</th>
                </tr>
            </thead>
            <tbody>
                {#each items as it}
                    <tr class="border-t">
                        <td class="py-2">{it.date ? new Date(it.date).toLocaleString() : '-'}</td>
                        <td class="py-2">{it.notes}</td>
                        <td class="py-2">{it.location}</td>
                        <td class="py-2">{#if it.display_url}<a class="text-alineados-green-600 hover:underline" href={it.display_url} target="_blank" rel="noreferrer noopener">Ver foto</a>{:else}-{/if}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</div>


