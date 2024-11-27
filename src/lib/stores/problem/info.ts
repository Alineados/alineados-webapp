import type { ProblemInfo } from '$lib/interfaces';
import { derived, writable } from 'svelte/store';
import { emptyGenericThree, emptyGenericTwo } from '../generic';

// Problem info store
export const pid = writable<string>('');
export const problemInfo = writable<ProblemInfo>();

// Function to initialize the store with the problem info
export const initProblemInfo = (info: ProblemInfo) => {
	if (info) {
		pid.set(info.pid);

		// evaluate the problem info
		if (!info.decision_taken) info.decision_taken = emptyGenericTwo();
		if (!info.problem) info.problem = emptyGenericTwo();
		if (info.involved.length === 0) info.involved = [{ ...emptyGenericTwo() }];
		if (info.contexts.length === 0) info.contexts = [{ ...emptyGenericTwo() }];
		if (info.objectives.length === 0) info.objectives = [{ ...emptyGenericTwo() }];
		if (info.alternatives.length === 0) info.alternatives = [{ ...emptyGenericTwo() }];
		if (info.action_plan.length === 0) info.action_plan = [{ ...emptyGenericThree() }];

		problemInfo.set(info);
	}
};

// Function to update the problem info (Autosave)
let timeoutId: number;
let endTimeoutId: number;

export const autosavingProblemInfo = derived([pid, problemInfo], (_, set) => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(() => {
		set(true);
		endTimeoutId = setTimeout(() => {
			set(false);
			clearTimeout(endTimeoutId);
		}, 1000);
	}, 1000);
});

export const problemInfoJSON = derived([problemInfo], ([$problemInfo], set) => {
	set(JSON.stringify($problemInfo));
});
