<script lang="ts">
    export let hasUnsavedChanges: boolean = false;
    export let lastSavedTime: Date | null = null;
</script>

<div class="ml-auto flex items-center gap-2 text-sm">
    {#if hasUnsavedChanges}
        <div class="flex items-center gap-1 text-orange-600">
            <div class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>Guardando...</span>
        </div>
    {:else if lastSavedTime}
        <div class="flex items-center gap-1 text-green-600">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Guardado {lastSavedTime.toLocaleTimeString()}</span>
        </div>
    {/if}
</div> 