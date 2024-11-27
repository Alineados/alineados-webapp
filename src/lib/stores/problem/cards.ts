import type { ProblemCard } from '$lib/interfaces';
import type { PillarsAndCategories } from '$lib/interfaces/Pillar.interface';
import { writable } from 'svelte/store';

// list of info about problems
export const healthProblems = writable<ProblemCard[]>();
export const relationalProblems = writable<ProblemCard[]>();
export const vocationalProblems = writable<ProblemCard[]>();
export const spiritualProblems = writable<ProblemCard[]>();

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

// Function to add a problem to the store
export const addProblem = (problem: ProblemCard, pillar: PillarsAndCategories) => {
	// get the key name of the pillar
	const key = Object.keys(pillar).find(
		(key) => pillar[key as keyof PillarsAndCategories].id === problem.pfid
	);

	console.log('key', key);

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
