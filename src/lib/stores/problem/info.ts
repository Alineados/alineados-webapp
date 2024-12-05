import type { ProblemInfo } from '$lib/interfaces';
import { ProblemType } from '$lib/interfaces';
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

// Function to insert new elements in the problem info arrays
export const addProblemItem = (previous_id: string, problemType: ProblemType) => {
	if (problemType === ProblemType.involved) {
		problemInfo.update((info) => {
			const index = info.involved.findIndex((inv) => inv.id === previous_id);
			info.involved.splice(index + 1, 0, { ...emptyGenericTwo() });
			return info;
		});
	}

	if (problemType === ProblemType.contexts) {
		problemInfo.update((info) => {
			const index = info.contexts.findIndex((inv) => inv.id === previous_id);
			info.contexts.splice(index + 1, 0, { ...emptyGenericTwo() });
			return info;
		});
	}

	if (problemType === ProblemType.objectives) {
		problemInfo.update((info) => {
			const index = info.objectives.findIndex((inv) => inv.id === previous_id);
			info.objectives.splice(index + 1, 0, { ...emptyGenericTwo() });
			return info;
		});
	}

	if (problemType === ProblemType.alternatives) {
		problemInfo.update((info) => {
			const index = info.alternatives.findIndex((inv) => inv.id === previous_id);
			info.alternatives.splice(index + 1, 0, { ...emptyGenericTwo() });
			return info;
		});
	}

	if (problemType === ProblemType.action_plan) {
		problemInfo.update((info) => {
			const index = info.action_plan.findIndex((inv) => inv.id === previous_id);
			info.action_plan.splice(index + 1, 0, { ...emptyGenericThree() });
			return info;
		});
	}
};

// Function to remove elements, if there is only one element, it will only clean the description value
export const removeOrCleanItem = (id: string, problemType: ProblemType) => {
	if (problemType === ProblemType.decision_taken) {
		problemInfo.update((info) => {
			info.decision_taken!.description = '';
			return info;
		});
	}

	if (problemType === ProblemType.problem) {
		problemInfo.update((info) => {
			info.problem!.description = '';
			return info;
		});
	}

	if (problemType === ProblemType.involved) {
		problemInfo.update((info) => {
			if (info.involved.length > 1) {
				const index = info.involved.findIndex((inv) => inv.id === id);
				info.involved.splice(index, 1);
			} else {
				const index = info.involved.findIndex((inv) => inv.id === id);
				info.involved[index].description = '';
			}
			return info;
		});
	}

	if (problemType === ProblemType.contexts) {
		problemInfo.update((info) => {
			if (info.contexts.length > 1) {
				const index = info.contexts.findIndex((inv) => inv.id === id);
				info.contexts.splice(index, 1);
			} else {
				const index = info.contexts.findIndex((inv) => inv.id === id);
				info.contexts[index].description = '';
			}
			return info;
		});
	}

	if (problemType === ProblemType.objectives) {
		problemInfo.update((info) => {
			if (info.objectives.length > 1) {
				const index = info.objectives.findIndex((inv) => inv.id === id);
				info.objectives.splice(index, 1);
			} else {
				const index = info.objectives.findIndex((inv) => inv.id === id);
				info.objectives[index].description = '';
			}
			return info;
		});
	}

	if (problemType === ProblemType.alternatives) {
		problemInfo.update((info) => {
			if (info.alternatives.length > 1) {
				const index = info.alternatives.findIndex((inv) => inv.id === id);
				info.alternatives.splice(index, 1);
			} else {
				const index = info.alternatives.findIndex((inv) => inv.id === id);
				info.alternatives[index].description = '';
			}
			return info;
		});
	}

	if (problemType === ProblemType.action_plan) {
		problemInfo.update((info) => {
			if (info.action_plan.length > 1) {
				const index = info.action_plan.findIndex((inv) => inv.id === id);
				info.action_plan.splice(index, 1);
			} else {
				const index = info.action_plan.findIndex((inv) => inv.id === id);
				info.action_plan[index].description = '';
			}
			return info;
		});
	}
};

// Function to prominent an item
export const prominentItem = (id: string, problemType: ProblemType) => {
	if (problemType === ProblemType.decision_taken) {
		problemInfo.update((info) => {
			info.decision_taken!.prominent = !info.decision_taken!.prominent;
			return info;
		});
	}

	if (problemType === ProblemType.problem) {
		problemInfo.update((info) => {
			info.problem!.prominent = !info.problem!.prominent;
			return info;
		});
	}

	if (problemType === ProblemType.involved) {
		problemInfo.update((info) => {
			const index = info.involved.findIndex((inv) => inv.id === id);
			info.involved[index].prominent = !info.involved[index].prominent;
			return info;
		});
	}

	if (problemType === ProblemType.contexts) {
		problemInfo.update((info) => {
			const index = info.contexts.findIndex((inv) => inv.id === id);
			info.contexts[index].prominent = !info.contexts[index].prominent;
			return info;
		});
	}

	if (problemType === ProblemType.objectives) {
		problemInfo.update((info) => {
			const index = info.objectives.findIndex((inv) => inv.id === id);
			info.objectives[index].prominent = !info.objectives[index].prominent;
			return info;
		});
	}

	if (problemType === ProblemType.alternatives) {
		problemInfo.update((info) => {
			const index = info.alternatives.findIndex((inv) => inv.id === id);
			info.alternatives[index].prominent = !info.alternatives[index].prominent;
			return info;
		});
	}

	if (problemType === ProblemType.action_plan) {
		problemInfo.update((info) => {
			const index = info.action_plan.findIndex((inv) => inv.id === id);
			info.action_plan[index].prominent = !info.action_plan[index].prominent;
			return info;
		});
	}
};
