<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import ProblemBody from '$lib/modules/dashboard/Problems/ProblemBody.svelte';
	import ProblemHeader from '$lib/modules/dashboard/Problems/ProblemHeader.svelte';
	import ProblemsFilter from '$lib/modules/dashboard/Problems/ProblemsFilter.svelte';
	import AsideProblem from '$lib/modules/dashboard/Problems/AsideProblem.svelte';
	import {
		initProblemCard,
		initProblemInfo,
		pid,
		pcid,
		problemCard,
		problemCardJSON,
		autosavingProblemCard,
		autosavingProblemInfo,
		problemInfoJSON
	} from '$lib/stores';
	import { SocketService } from '$lib/services/socket';

	// variables / states
	let socket: SocketService;

	// get data from server.ts
	let { data }: { data: any } = $props();

	$effect(() => {
		initProblemInfo({ ...data.problemInfo });
		initProblemCard({ ...data.problemCard });
	});

	let headerRef = $state<HTMLElement>();
	let problemsFilterRef = $state<HTMLElement>();
	let accountabilityBodyRef = $state<HTMLElement>();
	let asideProblemRef = $state<HTMLElement>();

	onMount(() => {
		initProblemInfo({ ...data.problemInfo });
		initProblemCard({ ...data.problemCard });

		// socket = new SocketService($pcid);

		const headerHeight = headerRef ? headerRef.offsetHeight : 0;
		const problemsFilterHeight = problemsFilterRef ? problemsFilterRef.offsetHeight : 0;

		if (problemsFilterRef) problemsFilterRef.style.top = `${headerHeight}px`;
		if (asideProblemRef) asideProblemRef.style.top = `${headerHeight}px`;

		if (accountabilityBodyRef)
			accountabilityBodyRef.style.top = `${headerHeight + problemsFilterHeight}px`;

		// return () => {
		// 	socket.disconnect();
		// };
	});
</script>

{#await $problemCard}
	<p>Loading...</p>
{:then}
	<div bind:this={headerRef} class="sticky top-0 z-10 bg-white">
		<ProblemHeader bind:title={$problemCard.problem_name} />
	</div>

	<div class="flex w-full items-start">
		<div class=" flex w-7/12 flex-col">
			<div bind:this={problemsFilterRef} class="sticky top-32 z-10 bg-white">
				<ProblemsFilter pid={$pid} pillar_name={data.pillar_name} />
			</div>

			<div bind:this={accountabilityBodyRef}>
				<ProblemBody />
			</div>
		</div>

		<div bind:this={asideProblemRef} class="sticky top-32 z-10 flex w-5/12 justify-center bg-white">
			<AsideProblem />
		</div>
	</div>
{:catch error}
	<p>{error.message}</p>
{/await}
