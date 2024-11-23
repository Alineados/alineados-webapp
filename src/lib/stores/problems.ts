import type { PillarItems, ProblemInfo } from '$lib/interfaces';
import { writable } from 'svelte/store';

// list of info about problems
export const healthProblems = writable<ProblemInfo[]>();
export const relationalProblems = writable<ProblemInfo[]>();
export const vocationalProblems = writable<ProblemInfo[]>();
export const spiritualProblems = writable<ProblemInfo[]>();

// Function to initialize the store with the problems
export const initProblems = ({
	health,
	relational,
	vocational,
	spiritual
}: {
	health: ProblemInfo[];
	relational: ProblemInfo[];
	vocational: ProblemInfo[];
	spiritual: ProblemInfo[];
}) => {
	if (health) healthProblems.set(health);
	if (relational) relationalProblems.set(relational);
	if (vocational) vocationalProblems.set(vocational);
	if (spiritual) spiritualProblems.set(spiritual);
};

// Function to add a problem to the store
export const addProblem = (problem: ProblemInfo, pillar: PillarItems) => {
	switch (pillar.value) {
		case 1:
			healthProblems.update((problems) => [...problems, problem]);
			break;
		case 2:
			relationalProblems.update((problems) => [...problems, problem]);
			break;
		case 3:
			vocationalProblems.update((problems) => [...problems, problem]);
			break;
		case 4:
			spiritualProblems.update((problems) => [...problems, problem]);
			break;
	}
};

// Function to remove a problem from the store
export const removeProblem = (problem: ProblemInfo, pillar: PillarItems) => {
	switch (pillar.value) {
		case 1:
			healthProblems.update((problems) => problems.filter((p) => p.id !== problem.id));
			break;
		case 2:
			relationalProblems.update((problems) => problems.filter((p) => p.id !== problem.id));
			break;
		case 3:
			vocationalProblems.update((problems) => problems.filter((p) => p.id !== problem.id));
			break;
		case 4:
			spiritualProblems.update((problems) => problems.filter((p) => p.id !== problem.id));
			break;
	}
};
