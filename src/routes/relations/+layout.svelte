<script lang="ts">
    import * as Sidebar from '$lib/shared/ui/sidebar';
    import AppSidebar from '$lib/components/AppSidebar.svelte';
    import { userState } from '$lib/stores';
    import { setContext } from 'svelte';
    import type { LayoutData } from './$types';

    let { data, children }: { data: LayoutData; children?: any } = $props();

    // Inicializar el userState con los datos del usuario
    if (data.user) {
        userState.init(data.user);
        console.log('✅ Relations Layout - User initialized:', data.user._id);
    } else {
        console.warn('⚠️ Relations Layout - No user data found');
    }

    // Establecer el token en el contexto si está disponible
    if (data.token) {
        setContext('token', data.token);
        console.log('✅ Relations Layout - Token set in context');
    }
</script>

<Sidebar.Provider>
    <AppSidebar />
    <Sidebar.Inset>
        {#if children}
            {@render children()}
        {/if}
    </Sidebar.Inset>
</Sidebar.Provider>