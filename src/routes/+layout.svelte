<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/shared/ui/sonner';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { pillarState, userState } from '$lib/stores';
	import type { LayoutProps } from './$types';
	import Loader from '$lib/shared/ui/loader/loader.svelte';

	let { data, children }: LayoutProps = $props();
	let isNavigating = $state(false);
	let isPreventedNavigation = $state(false);

	if (data.user && data.pillars) {
		userState.init(data.user);
		pillarState.init(data.pillars);
	}

	beforeNavigate(({ cancel, from, to }) => {
		// Don't show loader if navigation was prevented
		if (from?.url.pathname.includes('/thoughts') || from?.url.pathname.includes('/stories')) {
			const hasPreventedNavigation = window.confirm;
			if (hasPreventedNavigation) {
				isPreventedNavigation = true;
				return;
			}
		}
		isNavigating = true;
	});

	afterNavigate(() => {
		isNavigating = false;
		isPreventedNavigation = false;
	});
</script>

{#if isNavigating && !isPreventedNavigation}
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
		<Loader size="h-12 w-12" color="text-alineados-green-500" />
	</div>
{/if}

<Toaster />
{@render children?.()}
