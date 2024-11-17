<script lang="ts">
	import * as Sidebar from '$lib/shared/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/AppSidebar.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full">
		<Sidebar.Trigger />
    <div class="px-16 py-4">
      {@render children?.()}
    </div>
	</main>
</Sidebar.Provider>
