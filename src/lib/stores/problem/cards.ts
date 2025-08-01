import { FilterBy, type ProblemCard } from '$lib/interfaces';
import type { PillarsAndCategories } from '$lib/interfaces/Pillar.interface';
import { derived, writable, get } from 'svelte/store';
import { problemInfo, problemReadyToComplete } from './info';
import type { PillarState } from '$lib/stores';

// list of info about problems
export const healthProblems = writable<ProblemCard[]>();
export const relationalProblems = writable<ProblemCard[]>();
export const vocationalProblems = writable<ProblemCard[]>();
export const spiritualProblems = writable<ProblemCard[]>();

export const pcid = writable<string>(''); // Problem Card ID
export const problemCard = writable<ProblemCard>();

// Filters
export const filterBy = writable<string>(typeof FilterBy);

export const healthProblemsFiltered = derived(
	[healthProblems, filterBy],
	([$healthProblems, $filterBy]) => {
		console.log('healthProblemsFiltered updated:', $healthProblems?.length, 'problems');
		return $healthProblems?.filter((p) => {
			if ($filterBy === FilterBy.ACTIVE) return p.active && !p.completed_at;
			else if ($filterBy === FilterBy.INACTIVE) return !p.active;
			else if ($filterBy === FilterBy.FINISHED) return p.completed_at;
			else return true;
		});
	}
);

export const relationalProblemsFiltered = derived(
	[relationalProblems, filterBy],
	([$relationalProblems, $filterBy]) => {
		return $relationalProblems?.filter((p) => {
			if ($filterBy === FilterBy.ACTIVE) return p.active && !p.completed_at;
			else if ($filterBy === FilterBy.INACTIVE) return !p.active;
			else if ($filterBy === FilterBy.FINISHED) return p.completed_at;
			else return true;
		});
	}
);

export const vocationalProblemsFiltered = derived(
	[vocationalProblems, filterBy],
	([$vocationalProblems, $filterBy]) => {
		return $vocationalProblems?.filter((p) => {
			if ($filterBy === FilterBy.ACTIVE) return p.active && !p.completed_at;
			else if ($filterBy === FilterBy.INACTIVE) return !p.active;
			else if ($filterBy === FilterBy.FINISHED) return p.completed_at;
			else return true;
		});
	}
);

export const spiritualProblemsFiltered = derived(
	[spiritualProblems, filterBy],
	([$spiritualProblems, $filterBy]) => {
		return $spiritualProblems?.filter((p) => {
			if ($filterBy === FilterBy.ACTIVE) return p.active && !p.completed_at;
			else if ($filterBy === FilterBy.INACTIVE) return !p.active;
			else if ($filterBy === FilterBy.FINISHED) return p.completed_at;
			else return true;
		});
	}
);

// Function to sync problemCard changes to all card stores
export const syncProblemCardToStores = () => {
	const currentProblemCard = get(problemCard);
	console.log('syncProblemCardToStores called with:', currentProblemCard);
	if (currentProblemCard?.id && currentProblemCard?.problem_name) {
		console.log('Syncing problemCard to stores:', { id: currentProblemCard.id, name: currentProblemCard.problem_name });
		
		// Log current state of all stores
		const healthProblemsCurrent = get(healthProblems);
		const relationalProblemsCurrent = get(relationalProblems);
		const vocationalProblemsCurrent = get(vocationalProblems);
		const spiritualProblemsCurrent = get(spiritualProblems);
		
		console.log('Current stores state:', {
			health: healthProblemsCurrent?.length || 0,
			relational: relationalProblemsCurrent?.length || 0,
			vocational: vocationalProblemsCurrent?.length || 0,
			spiritual: spiritualProblemsCurrent?.length || 0
		});
		
		// Update in health problems
		healthProblems.update((problems) => {
			if (problems) {
				const problem = problems.find(p => p.id === currentProblemCard.id);
				if (problem && problem.problem_name !== currentProblemCard.problem_name) {
					console.log('Updating health problem name:', problem.problem_name, '->', currentProblemCard.problem_name);
					problem.problem_name = currentProblemCard.problem_name;
				}
			}
			return problems;
		});

		// Update in relational problems
		relationalProblems.update((problems) => {
			if (problems) {
				const problem = problems.find(p => p.id === currentProblemCard.id);
				if (problem && problem.problem_name !== currentProblemCard.problem_name) {
					console.log('Updating relational problem name:', problem.problem_name, '->', currentProblemCard.problem_name);
					problem.problem_name = currentProblemCard.problem_name;
				}
			}
			return problems;
		});

		// Update in vocational problems
		vocationalProblems.update((problems) => {
			if (problems) {
				const problem = problems.find(p => p.id === currentProblemCard.id);
				if (problem && problem.problem_name !== currentProblemCard.problem_name) {
					console.log('Updating vocational problem name:', problem.problem_name, '->', currentProblemCard.problem_name);
					problem.problem_name = currentProblemCard.problem_name;
				}
			}
			return problems;
		});

		// Update in spiritual problems
		spiritualProblems.update((problems) => {
			if (problems) {
				const problem = problems.find(p => p.id === currentProblemCard.id);
				if (problem && problem.problem_name !== currentProblemCard.problem_name) {
					console.log('Updating spiritual problem name:', problem.problem_name, '->', currentProblemCard.problem_name);
					problem.problem_name = currentProblemCard.problem_name;
				}
			}
			return problems;
		});
	}
};

// Function to initialize the store with the problems
export const initProblems = ({
	health,
	relational,
	vocational,
	spiritual
}: {
	health: ProblemCard[];
	relational: ProblemCard[];
	vocational: ProblemCard[];
	spiritual: ProblemCard[];
}) => {
	if (health) healthProblems.set(health);
	if (relational) relationalProblems.set(relational);
	if (vocational) vocationalProblems.set(vocational);
	if (spiritual) spiritualProblems.set(spiritual);
};

export const initProblemCard = (card: ProblemCard) => {
	if (card) {
		pcid.set(card.id);
		problemCard.set(card);
	}
};

// Function to update problem name in all card stores
export const updateProblemName = (problemId: string, newName: string) => {
	console.log('updateProblemName called:', { problemId, newName });

	// Update in health problems
	healthProblems.update((problems) => {
		if (problems) {
			const problem = problems.find(p => p.id === problemId);
			if (problem) {
				console.log('Updating health problem:', problem.problem_name, '->', newName);
				problem.problem_name = newName;
			}
		}
		return problems;
	});

	// Update in relational problems
	relationalProblems.update((problems) => {
		if (problems) {
			const problem = problems.find(p => p.id === problemId);
			if (problem) {
				console.log('Updating relational problem:', problem.problem_name, '->', newName);
				problem.problem_name = newName;
			}
		}
		return problems;
	});

	// Update in vocational problems
	vocationalProblems.update((problems) => {
		if (problems) {
			const problem = problems.find(p => p.id === problemId);
			if (problem) {
				console.log('Updating vocational problem:', problem.problem_name, '->', newName);
				problem.problem_name = newName;
			}
		}
		return problems;
	});

	// Update in spiritual problems
	spiritualProblems.update((problems) => {
		if (problems) {
			const problem = problems.find(p => p.id === problemId);
			if (problem) {
				console.log('Updating spiritual problem:', problem.problem_name, '->', newName);
				problem.problem_name = newName;
			}
		}
		return problems;
	});
};

// Function to update
// 1. active / inactive .....  2. security / non-security
export const updateSecurityAndActive = (kind: number) => {
	problemCard.update((card) => {
		if (kind === 1) card.active = !card.active;
		else if (kind === 2) card.security = !card.security;
		return card;
	});
};

// Function to add a problem to the store
export const addProblem = (problem: ProblemCard, key: string) => {
	console.log('addProblem called:', { problem, key, active: problem.active, is_new: problem.is_new });

	if (key === 'health') {
		healthProblems.update((problems) => [...problems, problem]);
	} else if (key === 'relational') {
		relationalProblems.update((problems) => [...problems, problem]);
	} else if (key === 'vocational') {
		vocationalProblems.update((problems) => [...problems, problem]);
	} else if (key === 'spiritual') {
		spiritualProblems.update((problems) => [...problems, problem]);
	}
};

// Function to remove a problem from the store
export const removeProblem = (problem: ProblemCard, key: string) => {

	if (key === 'health') {
		healthProblems.update((problems) => problems.filter((p) => p.id !== problem.id));
	} else if (key === 'relational') {
		relationalProblems.update((problems) => problems.filter((p) => p.id !== problem.id));
	} else if (key === 'vocational') {
		vocationalProblems.update((problems) => problems.filter((p) => p.id !== problem.id));
	} else if (key === 'spiritual') {
		spiritualProblems.update((problems) => problems.filter((p) => p.id !== problem.id));
	}
};

// Function to update the problem info (Autosave)
let timeoutId: ReturnType<typeof setTimeout>;
let endTimeoutId: ReturnType<typeof setTimeout>;

export const autosavingProblemCard = derived([problemCard], (_, set) => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(() => {
		set(true);
		endTimeoutId = setTimeout(() => {
			set(false);
			clearTimeout(endTimeoutId);
		}, 1000);
	}, 1000);
});

export const problemCardJSON = derived([problemCard], ([$problemCard], set) => {
	set(JSON.stringify($problemCard));
});

// Derived store to calculate the progress based on the number of action plans done in problem info
export const problemProgress = derived([problemInfo], ([$problemInfo]) => {
	if ($problemInfo.action_plan.length === 1 && $problemInfo.action_plan[0].description === '')
		return 0;

	const isEmpty = $problemInfo.action_plan[$problemInfo.action_plan.length - 1].description === '';

	let total = $problemInfo.action_plan.length;

	if (isEmpty) total -= 1;
	let done = $problemInfo.action_plan.filter((action) => action.done).length;

	const percentage = Math.round((done / total) * 100);

	// set the progress and if completed in the problem card
	problemCard.update((card) => {
		card.progress = percentage;

		return card;
	});

	return percentage;
});

// Function to complete a problem and card
export const isCompleteProblem = (complete: boolean) => {
	problemCard.update((card) => {
		if (complete) card.completed_at = new Date().toISOString();
		else card.completed_at = null;
		return card;
	});

	problemInfo.update((info) => {
		if (complete) info.solved = true;
		else info.solved = false;

		return info;
	});
};
