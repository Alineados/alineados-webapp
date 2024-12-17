<script lang="ts">
	import * as Select from '$lib/shared/ui/select/index';

	// Props
	let { name, pilars, value = $bindable() } = $props();

	// Problem Interface
	interface ProblemCard {
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
	}

	interface Problem {
		problem_card: ProblemCard;
	}

	interface Pilar {
		pilar_name: 'relationalID' | 'healthID' | 'spiritualID' | 'vocationalID';
		problems: Problem[];
	}

	const pilarNameMap = {
		relationalID: 'Relación',
		healthID: 'Salud',
		spiritualID: 'Espiritual',
		vocationalID: 'Vocación'
	};

	// Trigger content
	const triggerContent = $derived.by(() => {
		if (value === 'all') {
			return 'Seleccionar todo';
		}

		for (const pilar of pilars) {
			const foundItem = pilar.problems.find(
				(problem: Problem) => problem.problem_card.id === value
			);
			if (foundItem) {
				return foundItem.problem_card.problem_name;
			}
		}
		return 'Selecciona un problema';
	});
</script>

<div class="w-11/12 space-y-2">
	<Select.Root type="single" {name} bind:value>
		<Select.Trigger
			class="w-full border-alineados-gray-100  text-alineados-gray-700 focus:outline-none focus:ring-2 focus:ring-alineados-gray-100 data-[placeholder]:text-alineados-gray-700"
		>
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group class="bg-alineados-gray-50 ">
				<Select.Item class="bg-alineados-gray-50 " value="all" label="Seleccionar todos">
					Seleccionar todos
				</Select.Item>
			</Select.Group>

			{#each pilars as pilar (pilar.pilar_name)}
				<Select.Group class="bg-alineados-gray-50 ">
					<Select.GroupHeading class="bg-white text-base"
						>{pilarNameMap[pilar.pilar_name as keyof typeof pilarNameMap]}</Select.GroupHeading
					>
					{#each pilar.problems as problem}
						<Select.Item
							class="bg-white"
							value={problem.problem_card.id}
							label={problem.problem_card.problem_name}
						>
							{problem.problem_card.problem_name}
						</Select.Item>
					{/each}
				</Select.Group>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
