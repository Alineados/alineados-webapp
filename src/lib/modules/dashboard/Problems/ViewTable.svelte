<script lang="ts">
	import type { ProblemInfo } from '$lib/interfaces';
	import TableItem from '../../../components/TableItem.svelte';

	// Props
	let { pilars, selectedProblem, firstCriterion, secondCriterion } = $props();

	// Helper function to get descriptions based on criterion
	function getDescriptionsByCriterion(problemInfo: ProblemInfo, criterion: string) {
		if (criterion === 'decision_taken' || criterion === 'problem')
			return [problemInfo[criterion]?.description || ''];

		if (criterion === 'recommended_decision' || criterion === 'final_decision') {
			const id: string | null = problemInfo[criterion];

			return id ? [problemInfo.alternatives.find((item: any) => item.id === id)?.description] : [];
		}

		return (
			(problemInfo[criterion as keyof ProblemInfo] as any[])?.map(
				(item: any) => item.description
			) || []
		);
	}

	// Filter and transform problems data
	const problems = $derived.by(() => {
		const allProblems = selectedProblem.includes('all')
			? pilars.flatMap((pilar: any) => pilar.problems)
			: pilars.flatMap((pilar: any) =>
					pilar.problems.filter((p: any) => selectedProblem.includes(p.problem_card.id))
				);

		return allProblems.map((problem: any) => ({
			problemName: problem.problem_card.problem_name,
			firstCriterionData: getDescriptionsByCriterion(problem.problem_info, firstCriterion),
			secondCriterionData: getDescriptionsByCriterion(problem.problem_info, secondCriterion)
		}));
	});
</script>

{#each problems as problem, i}
	<div
		class:bg-white={i % 2 === 0}
		class:bg-alineados-gray-50={i % 2 !== 0}
		class="top-0 grid"
		style="grid-template-columns: 2fr 3fr 3fr;"
	>
		<div class="whitespace-nowrap px-6 py-3 text-left align-top text-base font-medium text-black">
			{problem.problemName}
		</div>
		<div>
			<div class="flex flex-col gap-y-4 px-6 py-3">
				{#each problem.firstCriterionData as description}
					{#if description !== ''}
						<TableItem value={description} />
					{/if}
				{/each}
			</div>
		</div>
		<div>
			<div class="flex flex-col gap-y-4 px-6 py-3">
				{#each problem.secondCriterionData as description}
					{#if description !== ''}
						<TableItem value={description} />
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/each}
