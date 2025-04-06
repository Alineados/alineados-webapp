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
	import { isEverythingEmpty, deleteEmptyProblem } from '$lib/utils/problem';
	import BackArrow from '$lib/icons/BackArrow.svelte';

	let socket: SocketService;
	let { title = $bindable() } = $props();

	$effect(() => {
		// Only autosave if there's content to save
		if ($autosavingProblemCard || $autosavingProblemInfo || $autosavingProblemMatrix) {
			if ($problemCard.problem_name?.trim()) {
				if ($autosavingProblemCard) socket.push('autosave_pc', $problemCardJSON as string);
				if ($autosavingProblemInfo) socket.push('autosave_pi', $problemInfoJSON as string);
				if ($autosavingProblemMatrix) socket.push('autosave_pm', $matrixJSON as string);
			}
		}
	});

	let titleInput: HTMLInputElement;
    let isFocused = $state(false);
    let displayTitle = $state('');
    let fullTitle = $state('');
    const MAX_LENGTH = 28;

    $effect(() => {
        if (title?.length > MAX_LENGTH) {
            displayTitle = title.substring(0, MAX_LENGTH) + '...';
        } else {
            displayTitle = title;
        }
        fullTitle = title;
    });

    function handleInput(e: Event) {
        const input = e.target as HTMLInputElement;
        title = input.value;
    }

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

<div class="flex flex-col gap-2 px-4 md:px-8 lg:px-16 w-full">
	<p class="flex flex-row text-sm font-medium text-alineados-gray-600">
		<a href="/personal/problems" class="text-alineados-gray-600 hover:underline"
			>Situaciones por Mejorar</a
		>
		<span class="mx-1">/</span>
		<span class="text-alineados-orange-900" title={fullTitle}>{displayTitle}</span>
	</p>
	<div
		class="flex flex-col items-start gap-5 border-b border-alineados-gray-100 pb-3 lg:flex-row lg:justify-between"
	>
		<div class="flex items-start gap-2">
			<input
				bind:this={titleInput}
				placeholder={isFocused ? "" : "Título de la Situación"}
				type="text"
				maxlength={MAX_LENGTH}
				bind:value={title}
				on:input={handleInput}
				on:focus={() => isFocused = true}
				on:blur={() => isFocused = false}
				class="relative bg-transparent text-5xl font-bold text-alineados-gray-900 focus:outline-none rounded-md px-2 {!title ? 'border-2 animate-border-cursor-blink' : 'border-none'} focus:border-alineados-orange-500 [caret-width:3px] [caret-color:alineados-orange-900]"
			/>
		</div>
		
		<div class="flex flex-row justify-start gap-4">
			<!-- Autosave and icons -->
			<div class="ml-5 flex items-center gap-3 pl-5">
				{#if $problemCard.security}
					<Padlock class="size-5" />
				<!-- {:else}
					<UnPadlock class="size-5" /> -->
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
			<AccountabilityButton />
			<a
				href="/personal/problems"
				class="focus group flex items-center gap-1 rounded-lg bg-alineados-gray-100 px-5 py-3 text-alineados-blue-900 transition duration-300 ease-in-out hover:shadow-lg"
			>
				<BackArrow class="size-4 font-bold text-alineados-blue-900" />
				<p class="text-xs font-medium">Regresar</p>
			</a>
			{#if $reportProblem === 1}
				<MoreButton />
			{/if}
		</div>
	</div>
</div>
