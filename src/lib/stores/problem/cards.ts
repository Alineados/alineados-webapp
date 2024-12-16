import { FilterBy, type ProblemCard } from '$lib/interfaces';
import type { PillarsAndCategories } from '$lib/interfaces/Pillar.interface';
import { derived, writable } from 'svelte/store';
import { problemInfo, problemReadyToComplete } from './info';

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
		return $healthProblems?.filter((p) => {
			if ($filterBy === FilterBy.ACTIVE) return p.active;
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
			if ($filterBy === FilterBy.ACTIVE) return p.active;
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
			if ($filterBy === FilterBy.ACTIVE) return p.active;
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
			if ($filterBy === FilterBy.ACTIVE) return p.active;
			else if ($filterBy === FilterBy.INACTIVE) return !p.active;
			else if ($filterBy === FilterBy.FINISHED) return p.completed_at;
			else return true;
		});
	}
);

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
export const addProblem = (problem: ProblemCard, pillar: PillarsAndCategories) => {
	// get the key name of the pillar
	const key = Object.keys(pillar).find(
		(key) => pillar[key as keyof PillarsAndCategories].id === problem.pfid
	);

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
export const removeProblem = (problem: ProblemCard, pillar: PillarsAndCategories) => {
	// get the key name of the pillar
	const key = Object.keys(pillar).find(
		(key) => pillar[key as keyof PillarsAndCategories].id === problem.pfid
	);

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
let timeoutId: number;
let endTimeoutId: number;

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
	const total = $problemInfo.action_plan.length;
	const done = $problemInfo.action_plan.filter((action) => action.done).length;
	const percentage = Math.round((done / total) * 100);

	// set the progress and if completed in the problem card
	problemCard.update((card) => {
		card.progress = percentage;

		return card;
	});

	return percentage;
});

// Function to complete a problem and card
export const completeProblem = () => {
	problemCard.update((card) => {
		card.completed_at = new Date().toISOString();
		return card;
	});

	problemInfo.update((info) => {
		info.solved = true;
		return info;
	});
};
