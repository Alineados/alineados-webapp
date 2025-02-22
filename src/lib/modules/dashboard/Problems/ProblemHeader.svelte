<script lang="ts">
	import AccountabilityButton from '$lib/components/AccountabilityButton.svelte';
	import MoreButton from '$lib/components/MoreButton.svelte';
	import StatusPill from '$lib/components/StatusPill.svelte';

	import Padlock from '$lib/icons/Padlock.svelte';
	import {
		autosavingProblemCard,
		autosavingProblemInfo,
		pcid,
		problemCardJSON,
		problemInfoJSON,
		problemCard,
		reportProblem,
		matrixJSON,
		autosavingProblemMatrix
	} from '$lib/stores';

	import Cloud from '$lib/icons/Cloud.svelte';
	import Loading from '$lib/icons/Loading.svelte';
	import { onMount } from 'svelte';
	import { SocketService } from '$lib/services/socket';
	import UnPadlock from '$lib/icons/UnPadlock.svelte';
	import { browser } from '$app/environment';

	let socket: SocketService;
	let { title = $bindable() } = $props();

	$effect(() => {
		if ($autosavingProblemCard) socket.push('autosave_pc', $problemCardJSON as string);

		if ($autosavingProblemInfo) socket.push('autosave_pi', $problemInfoJSON as string);

		if ($autosavingProblemMatrix) socket.push('autosave_pm', $matrixJSON as string);
	});

	onMount(() => {
		if (browser) {
			socket = new SocketService($pcid);
		}
		socket = new SocketService($pcid);
		return () => {
			socket.disconnect();
		};
	});
</script>

<div class="flex flex-col gap-2 px-4 md:px-8 lg:px-16">
	<p class="flex flex-row text-sm font-medium text-alineados-gray-600">
		<a href="/personal/problems" class="text-alineados-gray-600 hover:underline"
			>Situaciones por Mejorar</a
		>
		<span class="mx-1">/</span>
		<span class="text-alineados-orange-900">{title}</span>
	</p>
	<div
		class="flex flex-col items-start gap-5 border-b border-alineados-gray-100 pb-3 lg:flex-row lg:justify-between"
	>
		<div class="flex items-start gap-2">
			<input
			placeholder="Situación por mejorar"
				type="text"
				maxlength="28"
				bind:value={title}
				class="border-none bg-transparent text-5xl font-bold text-alineados-gray-900 focus:outline-none"
			/>
			<!-- Autosave and icons -->

			<div class="ml-5 flex items-center gap-3 pl-5">
				{#if $problemCard.security}
					<Padlock class="size-5" />
				{:else}
					<UnPadlock class="size-5" />
				{/if}
				<StatusPill status={$problemCard.active} bind:completed={$problemCard.completed_at} />
				{#if $autosavingProblemCard || $autosavingProblemInfo || $autosavingProblemMatrix}
					<div class="h-6 w-6 animate-spin text-white">
						<Loading />
					</div>
				{:else}
					<Cloud styleTw="size-6 text-alineados-gray-400" />
				{/if}
			</div>
		</div>

		<div class="flex flex-row justify-start gap-4">
			<AccountabilityButton />
			{#if $reportProblem === 1}
				<MoreButton />
			{/if}
		</div>
	</div>
</div>
