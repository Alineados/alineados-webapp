<script lang="ts">
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import Info from '$lib/modules/settings/info/Info.svelte';
	import Notifications from '$lib/modules/settings/preference/notifications.svelte';
	import Security from '$lib/modules/settings/security/security.svelte';
	import { Phx } from '$lib/utils/channels';
	import { infoState } from '$lib/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	let convPhx: Phx;

	let { data }: PageProps = $props();

	onMount(() => {
		// webWorker
		if (browser) {
			// channels
			convPhx = new Phx();
			convPhx.joint(`autosave:${data.userId}`);
		}
		return () => convPhx.socket.disconnect();
	});

	infoState.init(data.settings);

	$inspect(infoState.starting);
	// autosave
	let timeout: NodeJS.Timeout;
	// let autosave: boolean = $state(false);
	$effect(() => {
		$state.snapshot(infoState.infoStr);
		// autosave = true;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (convPhx) {
				convPhx.channel?.push('autosave_settings', {
					uid: data.userId,
					body: infoState.infoStr
				});
			}
			// autosave = false;
		}, 2000);
	});
</script>

{#if page?.params?.menu === 'info'}
	<Info />
{:else if page.params.menu === 'preferences'}
	<Notifications />
{:else if page.params.menu === 'security'}
	<Security />
{/if}
