<script lang="ts">
	import * as Sidebar from '$lib/shared/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<main class="min-h-full w-full">
			<Sidebar.Trigger class=" md:hidden lg:hidden" />
			<div class="px-4 py-2 md:px-8 md:py-3 lg:px-16 lg:py-4 lg:pb-20">
				{@render children?.()}
			</div>
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
