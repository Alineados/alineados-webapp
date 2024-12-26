<script lang="ts">
	import * as Select from '$lib/shared/ui/select/index';
	import * as Collapsible from '$lib/shared/ui/collapsible/index';
	import { ChevronRight, ChevronDown } from 'lucide-svelte';

	// Props
	let { name, pilars, value = $bindable<string[]>([]) } = $props();

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

	// Handle select value changes
	let previousValue: string[] = [];
	let isTransitioningFromAll = false;

	function handleValueChange(newValue: string[]) {
		// Case 1: Selecting 'all' - clear other selections
		if (newValue.includes('all') && !previousValue.includes('all')) {
			value = ['all'];
			previousValue = ['all'];
			isTransitioningFromAll = false;
			return;
		}

		// Case 2: Moving from 'all' to specific selections
		if (previousValue.includes('all')) {
			isTransitioningFromAll = true;
			value = newValue.filter((v) => v !== 'all');
			previousValue = [...value];
			return;
		}

		// Case 3: Normal selection/deselection
		if (!isTransitioningFromAll && !newValue.includes('all')) {
			value = newValue;
			previousValue = [...value];
			return;
		}

		isTransitioningFromAll = false;
	}

	// Trigger content
	const triggerContent = $derived.by(() => {
		if (value.includes('all')) {
			return 'Seleccionar todos';
		}
		return value.length === 0 ? 'Selecciona un problema' : `Seleccionado(s) (${value.length})`;
	});
</script>

<div class="w-11/12 space-y-2">
	<Select.Root type="multiple" {name} bind:value onValueChange={handleValueChange}>
		<Select.Trigger
			class="w-full border-alineados-gray-100  text-alineados-gray-700 focus:outline-none focus:ring-2 focus:ring-alineados-gray-100 data-[placeholder]:text-alineados-gray-700"
		>
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group class="bg-alineados-gray-50 ">
				<Select.Item class="bg-white" value="all" label="Seleccionar todos">
					Seleccionar todos
				</Select.Item>
			</Select.Group>

			{#each pilars as pilar (pilar.pilar_name)}
				<Collapsible.Root class="group/collapsible">
					<Select.Group class="bg-alineados-gray-50">
						<Collapsible.Trigger>
							{#snippet child({ props })}
								<Select.GroupHeading
									{...props}
									class="flex  items-center justify-between bg-white text-base"
									>{pilarNameMap[pilar.pilar_name as keyof typeof pilarNameMap]}
									<ChevronRight
										size={16}
										class="transition-transform group-data-[state=open]/collapsible:rotate-90"
									/>
								</Select.GroupHeading>
							{/snippet}
						</Collapsible.Trigger>

						<Collapsible.Content>
							{#each pilar.problems as problem}
								<Select.Item
									class="bg-white"
									value={problem.problem_card.id}
									label={problem.problem_card.problem_name}
									spellcheck="false"
								>
									{problem.problem_card.problem_name}
								</Select.Item>
							{/each}
						</Collapsible.Content>
					</Select.Group>
				</Collapsible.Root>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
