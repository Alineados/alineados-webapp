<script lang="ts">
    import { autosaveStatus, lastSavedAt } from '$lib/stores/pillar/category';
    import { 
        relationAutosaveStatus, 
        relationLastSavedAt, 
        isOnline as relationIsOnline 
    } from '$lib/stores/relations/autosave';
    import Cloud from '$lib/icons/Cloud.svelte';
    import Loading from '$lib/icons/Loading.svelte';
    import CircleCheck from '$lib/icons/CircleCheck.svelte';
    import CircleCross from '$lib/icons/CircleCross.svelte';
    import type { Readable } from 'svelte/store';

    // Props
    let { 
        showTimestamp = true, 
        isRelationMode = false 
    } = $props<{ 
        showTimestamp?: boolean;
        isRelationMode?: boolean;
    }>();

    // Use appropriate stores based on mode
    const statusStore = isRelationMode ? relationAutosaveStatus : autosaveStatus;
    const lastSavedStore = isRelationMode ? relationLastSavedAt : lastSavedAt;
    const onlineStore = isRelationMode ? relationIsOnline : null;

    // Función para formatear el timestamp estilo Notion
    function formatTimestamp(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (seconds < 10) return 'Guardado';
        if (seconds < 60) return `Guardado hace ${seconds}s`;
        if (minutes === 1) return 'Guardado hace 1 min';
        if (minutes < 60) return `Guardado hace ${minutes} min`;
        if (hours === 1) return 'Guardado hace 1 hora';
        if (hours < 24) return `Guardado hace ${hours} horas`;
        if (days === 1) return 'Guardado hace 1 día';
        if (days < 7) return `Guardado hace ${days} días`;
        
        // For older dates, show actual date
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Get status text
    function getStatusText(status: string, isOnline: boolean | null): string {
        switch (status) {
            case 'saving':
                return 'Guardando...';
            case 'saved':
                return 'Guardado';
            case 'error':
                return 'Error al guardar';
            case 'offline':
                return 'Sin conexión';
            case 'idle':
            default:
                return isOnline === false ? 'Sin conexión' : 'Sin cambios';
        }
    }

    // Get status color
    function getStatusColor(status: string, isOnline: boolean | null): string {
        switch (status) {
            case 'saving':
                return 'text-yellow-600';
            case 'saved':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            case 'offline':
                return 'text-orange-600';
            case 'idle':
            default:
                return isOnline === false ? 'text-orange-600' : 'text-gray-500';
        }
    }
</script>

<!-- Professional Autosave Indicator (Notion Style) -->
<div class="flex items-center gap-1 text-xs font-medium">
    {#if isRelationMode}
        {@const currentStatus = $statusStore}
        {@const currentLastSaved = $lastSavedStore}
        {@const currentOnline = onlineStore ? $onlineStore : true}
        {@const statusColor = getStatusColor(currentStatus, currentOnline)}
        
        <div class="flex items-center gap-1 {statusColor}">
            {#if currentStatus === 'saving'}
                <Loading style="h-3 w-3" />
                <span>Guardando...</span>
            {:else if currentStatus === 'saved' && currentLastSaved}
                <CircleCheck styleTw="h-3 w-3" />
                {#if showTimestamp}
                    <span>{formatTimestamp(currentLastSaved)}</span>
                {:else}
                    <span>Guardado</span>
                {/if}
            {:else if currentStatus === 'error'}
                <CircleCross styleTw="h-3 w-3" />
                <span>Error al guardar</span>
            {:else if currentStatus === 'offline' || currentOnline === false}
                <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                <span>Sin conexión</span>
            {:else}
                <Cloud styleTw="h-3 w-3" />
                <span>Sin cambios</span>
            {/if}
        </div>
    {:else}
        {@const currentStatus = $statusStore}
        {@const currentLastSaved = $lastSavedStore}
        {@const statusColor = getStatusColor(currentStatus, null)}
        
        <div class="flex items-center gap-1 {statusColor}">
            {#if currentStatus === 'saving'}
                <Loading style="h-3 w-3" />
                <span>Guardando...</span>
            {:else if currentStatus === 'saved' && currentLastSaved}
                <CircleCheck styleTw="h-3 w-3" />
                {#if showTimestamp}
                    <span>{formatTimestamp(currentLastSaved)}</span>
                {:else}
                    <span>Guardado</span>
                {/if}
            {:else if currentStatus === 'error'}
                <CircleCross styleTw="h-3 w-3" />
                <span>Error al guardar</span>
            {:else}
                <Cloud styleTw="h-3 w-3" />
                <span>Sin cambios</span>
            {/if}
        </div>
    {/if}
</div> 