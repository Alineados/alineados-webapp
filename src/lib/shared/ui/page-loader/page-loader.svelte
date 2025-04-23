<script lang="ts">
    import { isPageLoading } from '$lib/stores/loading';
    import Loader from '$lib/shared/ui/loader/loader.svelte';
</script>

{#if $isPageLoading}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <Loader size="h-12 w-12" color="text-alineados-green-500" />
    </div>
{/if}