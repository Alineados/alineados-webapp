<script lang="ts">
	import ProblemBody from '$lib/modules/dashboard/Problems/ProblemBody.svelte';
	import ProblemHeader from '$lib/modules/dashboard/Problems/ProblemHeader.svelte';
	import ProblemsFilter from '$lib/modules/dashboard/Problems/ProblemsFilter.svelte';
	import ViewProblem from '$lib/modules/dashboard/Problems/ViewProblem.svelte';
</script>

<ProblemHeader />

<div class="flex w-full items-start pb-10">
	<div class="flex w-7/12 flex-col">
		<ProblemsFilter />
		<ProblemBody />
	</div>

	<div class="flex w-5/12 justify-center">
		<ViewProblem />
	</div>
</div>
