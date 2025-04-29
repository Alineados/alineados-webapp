<script lang="ts">
    import * as Sidebar from '$lib/shared/ui/sidebar';
    import AppSidebar from '$lib/components/AppSidebar.svelte';
</script>

<Sidebar.Provider>
    <AppSidebar />
    <Sidebar.Inset>
        <slot />
    </Sidebar.Inset>
</Sidebar.Provider>