<script lang="ts">
	import * as Sidebar from '$lib/shared/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/AppSidebar.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full">
		<Sidebar.Trigger />
		<div class="px-4 py-2 md:px-8 md:py-3 lg:px-16 lg:py-4 lg:pb-20">
			{@render children?.()}
		</div>
	</main>
</Sidebar.Provider>
