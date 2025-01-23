<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/shared/ui/sonner';

	import { pillarState, userState } from '$lib/stores';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	if (data.user && data.pillars) {
		userState.init(data.user);
		pillarState.init(data.pillars);
	}
</script>

<Toaster />
{@render children?.()}
