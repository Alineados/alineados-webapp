<script lang="ts">
    import { autosaveStatus, lastSavedAt } from '$lib/stores';
    import Cloud from '$lib/icons/Cloud.svelte';
    import Loading from '$lib/icons/Loading.svelte';
    import CheckCircle from '$lib/icons/CheckCircle.svelte';
    import AlertCircle from '$lib/icons/AlertCircle.svelte';

    // Props
    let { showTimestamp = true } = $props<{ showTimestamp?: boolean }>();

    // Función para formatear el timestamp
    function formatTimestamp(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'Ahora mismo';
        if (minutes === 1) return 'Hace 1 minuto';
        if (minutes < 60) return `Hace ${minutes} minutos`;
        
        const hours = Math.floor(minutes / 60);
        if (hours === 1) return 'Hace 1 hora';
        return `Hace ${hours} horas`;
    }
</script>

<div class="flex items-center gap-2 text-xs text-gray-500">
    {#if $autosaveStatus === 'saving'}
        <div class="flex items-center gap-1">
            <div class="h-3 w-3 animate-spin">
                <Loading />
            </div>
            <span>Guardando...</span>
        </div>
    {:else if $autosaveStatus === 'saved'}
        <div class="flex items-center gap-1 text-green-600">
            <CheckCircle class="h-3 w-3" />
            <span>Guardado</span>
            {#if showTimestamp && $lastSavedAt}
                <span class="text-gray-400">• {formatTimestamp($lastSavedAt)}</span>
            {/if}
        </div>
    {:else if $autosaveStatus === 'error'}
        <div class="flex items-center gap-1 text-red-600">
            <AlertCircle class="h-3 w-3" />
            <span>Error al guardar</span>
        </div>
    {:else}
        <div class="flex items-center gap-1">
            <Cloud class="h-3 w-3 text-gray-400" />
            <span>Sin cambios</span>
        </div>
    {/if}
</div> 