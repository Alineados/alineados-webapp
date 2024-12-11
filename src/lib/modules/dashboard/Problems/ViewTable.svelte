<script lang="ts">
	import TableItem from '../../../components/TableItem.svelte';

	interface ProblemType {
		problem_card: {
			id: string;
			uid: string;
			pfid: string;
			cid: string;
			problem_name: string;
			category_name: string;
			pillar_name: string;
			milestone_date: string;
			progress: number;
			active: boolean;
			security: boolean;
			is_new: boolean;
			created_at: string;
			updated_at: string;
			deleted_at: string | null;
			completed_at: string | null;
		};
		problem_info: {
			id: string;
			pid: string;
			decision_taken: {
				id: string;
				created_at: string;
				description: string;
				deleted: boolean;
				prominent: boolean;
				repeatable: boolean;
				daily: boolean;
			};
			problem: {
				id: string;
				created_at: string;
				description: string;
				deleted: boolean;
				prominent: boolean;
				repeatable: boolean;
				daily: boolean;
			};
			involved: Array<{
				id: string;
				created_at: string;
				description: string;
				deleted: boolean;
				prominent: boolean;
				repeatable: boolean;
				daily: boolean;
			}>;
			contexts: Array<{
				id: string;
				created_at: string;
				description: string;
				deleted: boolean;
				prominent: boolean;
				repeatable: boolean;
				daily: boolean;
			}>;
			objectives: Array<{
				id: string;
				created_at: string;
				description: string;
				deleted: boolean;
				prominent: boolean;
				repeatable: boolean;
				daily: boolean;
			}>;
			alternatives: Array<{
				id: string;
				created_at: string;
				description: string;
				deleted: boolean;
				prominent: boolean;
				repeatable: boolean;
				daily: boolean;
			}>;
			action_plan: Array<{
				id: string;
				created_at: string;
				description: string;
				deleted: boolean;
				prominent: boolean;
				repeatable: boolean;
				daily: boolean;
			}>;
			memories: any[];
			final_decision: null | any;
			solved: boolean;
			created_at: string;
			updated_at: string;
		};
	}

	// Props
	let { pilars, selectedProblem, firstCriterion, secondCriterion } = $props();

	$inspect({ pilars });
	$inspect({ selectedProblem });

	// Helper function to get descriptions based on criterion
	function getDescriptionsByCriterion(problemInfo: any, criterion: string) {
		if (criterion === 'decision_taken' || criterion === 'problem') {
			return [problemInfo[criterion]?.description || ''];
		}

		return problemInfo[criterion]?.map((item: any) => item.description) || [];
	}

	// Filter and transform problems data
	const problems = $derived.by(() => {
		const allProblems =
			selectedProblem === 'all'
				? pilars.flatMap((pilar: any) => pilar.problems)
				: pilars.flatMap((pilar: any) =>
						pilar.problems.filter((p: any) => p.problem_card.id === selectedProblem)
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
		<div class="whitespace-nowrap px-6 py-8 text-left align-top text-base font-medium text-black">
			{problem.problemName}
		</div>
		<div>
			<div class="flex flex-col gap-y-4 px-6 py-8">
				{#each problem.firstCriterionData as description}
					<TableItem value={description} />
				{/each}
			</div>
		</div>
		<div>
			<div class="flex flex-col gap-y-4 px-6 py-8">
				{#each problem.secondCriterionData as description}
					<TableItem value={description} />
				{/each}
			</div>
		</div>
	</div>
{/each}
