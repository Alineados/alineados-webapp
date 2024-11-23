<script lang="ts">
	import ProblemBody from '$lib/modules/dashboard/Problems/ProblemBody.svelte';
	import ProblemHeader from '$lib/modules/dashboard/Problems/ProblemHeader.svelte';
	import ProblemsFilter from '$lib/modules/dashboard/Problems/ProblemsFilter.svelte';
	import ViewProblem from '$lib/modules/dashboard/Problems/ViewProblem.svelte';
</script>

<div class="sticky top-0 z-10 bg-white">
	<ProblemHeader />
</div>

<div class="flex w-full items-start pb-10">
	<div class=" flex w-7/12 flex-col">
		<div class="sticky top-32 z-10 bg-white">
			<ProblemsFilter />
		</div>

		<div class="pl-10">
			<ProblemBody />
		</div>
	</div>

	<div class="sticky top-32 z-10 flex w-5/12 justify-center bg-white">
		<ViewProblem />
	</div>
</div>
