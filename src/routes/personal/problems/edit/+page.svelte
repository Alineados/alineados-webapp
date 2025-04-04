<script lang="ts">
	import { onMount } from 'svelte';
	import { goto, beforeNavigate } from '$app/navigation';
	import { ProblemService } from '$lib/services/personal/problems';
	import ProblemBody from '$lib/modules/dashboard/Problems/ProblemBody.svelte';
	import ProblemHeader from '$lib/modules/dashboard/Problems/ProblemHeader.svelte';
	import ProblemsFilter from '$lib/modules/dashboard/Problems/ProblemsFilter.svelte';
	import AsideProblem from '$lib/modules/dashboard/Problems/AsideProblem.svelte';
	import {
		initImages,
		initMatrix,
		initProblemCard,
		initProblemInfo,
		pid,
		problemCard,
		reportProblem
	} from '$lib/stores';
	import AccountabilityBody from '$lib/modules/dashboard/Problems/AccountabilityBody.svelte';
	import DateDialog from '$lib/components/DateDialog.svelte';
	import AlertDialog from '$lib/components/AlertDialog.svelte';
	import { problemInfo } from '$lib/stores';
	import { isEverythingEmpty, deleteEmptyProblem } from '$lib/utils/problem';

	// get data from server.ts
	let { data }: { data: any } = $props();

	$effect(() => {
		initProblemInfo({ ...data.problemInfo });
		initProblemCard({ ...data.problemCard });
		initMatrix({ ...data.problemMatrix });
		initImages(data.urlImages);
	});

	let headerRef = $state<HTMLElement>();
	let problemsFilterRef = $state<HTMLElement>();
	let accountabilityBodyRef = $state<HTMLElement>();
	let asideProblemRef = $state<HTMLElement>();
	let date = $state('');
	let closeDialog = $state(false);
	let openDateModal = $state(false);
	let showAlert = $state(false);
	let pendingNavigation = $state<any>(null);

	$effect(() => {
		openDateModal = $problemCard.is_new && !closeDialog;
	});

	// function
	function handleDate() {
		closeDialog = true;
		$problemCard.milestone_date = date;
		// reset date
		date = '';
	}

	// Update navigation guard
	beforeNavigate(async (navigation) => {
		// Skip warning if it's a page refresh
		if (navigation.type === 'leave') return;

		// Si no hay título, mostrar diálogo con opciones
		if (!$problemCard.problem_name?.trim()) {
			showAlert = true;
			pendingNavigation = navigation;
			navigation.cancel();
			return;
		}
	});

	async function handleDeleteProblem() {
		// Simplemente cerrar el modal y cancelar la navegación
		showAlert = false;
		pendingNavigation = null;
	}

	onMount(() => {
		initProblemInfo({ ...data.problemInfo });
		initProblemCard({ ...data.problemCard });
		initMatrix({ ...data.problemMatrix });
		initImages(data.urlImages);

		$reportProblem = 1;

		// Remove dynamic top positioning
		const headerHeight = headerRef ? headerRef.offsetHeight : 0;
		const problemsFilterHeight = problemsFilterRef ? problemsFilterRef.offsetHeight : 0;

		if (accountabilityBodyRef)
			accountabilityBodyRef.style.marginTop = `${problemsFilterHeight}px`;

		// Update beforeunload handler
		window.addEventListener('beforeunload', (event) => {
			if (!$problemCard.problem_name?.trim()) {
				event.preventDefault();
				event.returnValue = 'Debe de completar el título para poder salir';
				return event.returnValue;
			}
		});

		return () => {
			window.removeEventListener('beforeunload', () => {});
		};
	});
</script>

{#if !$problemCard}
    <p>Loading...</p>
{:else}
    <div class="flex min-h-screen flex-col overflow-x-hidden">
        <div bind:this={headerRef} class="sticky top-0 z-50 w-full bg-white">
            <ProblemHeader bind:title={$problemCard.problem_name} />
        </div>

        <div class="flex min-w-0">
            <div class="flex w-3/4 flex-col overflow-x-auto">
                {#if $reportProblem !== 2}
                    <div bind:this={problemsFilterRef} class="sticky z-40 w-full bg-white">
                        <ProblemsFilter pid={$pid} pillar_name={data.pillar_name} />
                    </div>
                {/if}

                <div class="pl-4 pr-4 md:pl-8 lg:pl-16" bind:this={accountabilityBodyRef}>
                    {#if $reportProblem === 2}
                        <AccountabilityBody />
                    {:else}
                        <ProblemBody />
                    {/if}
                </div>
            </div>
            <div
                bind:this={asideProblemRef}
                class="sticky top-[64px] z-40 w-1/4 flex-shrink-0 pr-4 md:pr-8 lg:pr-16"
            >
                <AsideProblem bind:openDateModal />
            </div>
        </div>
    </div>
    <div class="flex">
        <DateDialog bind:open={openDateModal} bind:date confirm={handleDate} />
        <AlertDialog
            bind:open={showAlert}
            title="Atención"
            description="Debe completar el título antes de salir."
            cancel="Aceptar"
            action=""
            handleAction={() => {}}
            handleCancel={() => showAlert = false}
        />
    </div>
{/if}
