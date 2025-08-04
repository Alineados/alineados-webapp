<script lang="ts">
    import File from '$lib/icons/File.svelte';
    import Loading from '$lib/icons/Loading.svelte';
    
    let { 
        onClick,
        isLoading = false
    }: { 
        onClick: () => void;
        isLoading?: boolean;
    } = $props();
</script>

<button
    class="group flex items-center gap-[6px] rounded-lg bg-alineados-gray-100 px-5 py-4 text-alineados-blue-900 transition duration-300 ease-in-out hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label="Exportar"
    on:click={onClick}
    disabled={isLoading}
>
    {#if isLoading}
        <div class="h-4 w-4 animate-spin">
            <Loading />
        </div>
        <p class="text-sm font-medium">Generando PDF...</p>
    {:else}
        <File class="size-4" />
        <p class="text-sm font-medium">Exportar</p>
    {/if}
</button> 