import type { ProblemInfo } from '$lib/interfaces';
import { ProblemType } from '$lib/interfaces';
import { derived, writable } from 'svelte/store';
import { emptyGeneric } from '../generic';

// Problem info store
export const pid = writable<string>(''); // Problem info ID
export const problemInfo = writable<ProblemInfo>();
export const problemReadyToComplete = writable<boolean>(false);

// function to check if the problem is ready to be completed
export const changeCompleteStatus = (ready: boolean) => {
	problemReadyToComplete.set(ready);
};

/**
 * 1. default
 * 2. report
 */
export const reportProblem = writable<number>(1);

export const changeReportProblem = (report: number) => {
	reportProblem.update((r) => {
		if (r === report) return 1;
		else return report;
	});
};

// Function to initialize the store with the problem info
export const initProblemInfo = (info: ProblemInfo) => {
	if (info) {
		pid.set(info.pid);

		// evaluate the problem info
		if (!info.decision_taken) info.decision_taken = emptyGeneric();
		if (!info.problem) info.problem = emptyGeneric();
		if (info.involved.length === 0) info.involved = [{ ...emptyGeneric() }];
		if (info.contexts.length === 0) info.contexts = [{ ...emptyGeneric() }];
		if (info.objectives.length === 0) info.objectives = [{ ...emptyGeneric() }];
		if (info.alternatives.length === 0) info.alternatives = [{ ...emptyGeneric() }];
		if (info.action_plan.length === 0) info.action_plan = [{ ...emptyGeneric() }];

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

// Function to change the id of the final decision taken
export const changeFinalDecision = (id: string) => {
	problemInfo.update((info) => {
		info.final_decision = id;
		return info;
	});
};

// Function to insert new elements in the problem info arrays
export const addProblemItem = (previous_id: string, problemType: ProblemType) => {
	if (problemType === ProblemType.involved) {
		problemInfo.update((info) => {
			const index = info.involved.findIndex((inv) => inv.id === previous_id);
			info.involved.splice(index + 1, 0, { ...emptyGeneric() });
			return info;
		});
	}

	if (problemType === ProblemType.contexts) {
		problemInfo.update((info) => {
			const index = info.contexts.findIndex((inv) => inv.id === previous_id);
			info.contexts.splice(index + 1, 0, { ...emptyGeneric() });
			return info;
		});
	}

	if (problemType === ProblemType.objectives) {
		problemInfo.update((info) => {
			const index = info.objectives.findIndex((inv) => inv.id === previous_id);
			info.objectives.splice(index + 1, 0, { ...emptyGeneric() });


			return info;
		});
	}

	if (problemType === ProblemType.alternatives) {
		problemInfo.update((info) => {
			const index = info.alternatives.findIndex((inv) => inv.id === previous_id);
			info.alternatives.splice(index + 1, 0, { ...emptyGeneric() });
			return info;
		});
	}

	if (problemType === ProblemType.action_plan) {
		problemInfo.update((info) => {
			const index = info.action_plan.findIndex((inv) => inv.id === previous_id);
			info.action_plan.splice(index + 1, 0, { ...emptyGeneric() });
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

// Function to mark as daily item
export const markDailytItem = (id: string, problemType: ProblemType) => {
	if (problemType === ProblemType.decision_taken) {
		problemInfo.update((info) => {
			info.decision_taken!.daily = !info.decision_taken!.daily;
			return info;
		});
	}

	if (problemType === ProblemType.problem) {
		problemInfo.update((info) => {
			info.problem!.daily = !info.problem!.daily;
			return info;
		});
	}

	if (problemType === ProblemType.involved) {
		problemInfo.update((info) => {
			const index = info.involved.findIndex((inv) => inv.id === id);
			info.involved[index].daily = !info.involved[index].daily;
			return info;
		});
	}

	if (problemType === ProblemType.contexts) {
		problemInfo.update((info) => {
			const index = info.contexts.findIndex((inv) => inv.id === id);
			info.contexts[index].daily = !info.contexts[index].daily;
			return info;
		});
	}

	if (problemType === ProblemType.objectives) {
		problemInfo.update((info) => {
			const index = info.objectives.findIndex((inv) => inv.id === id);
			info.objectives[index].daily = !info.objectives[index].daily;
			return info;
		});
	}

	if (problemType === ProblemType.alternatives) {
		problemInfo.update((info) => {
			const index = info.alternatives.findIndex((inv) => inv.id === id);
			info.alternatives[index].daily = !info.alternatives[index].daily;
			return info;
		});
	}

	if (problemType === ProblemType.action_plan) {
		problemInfo.update((info) => {
			const index = info.action_plan.findIndex((inv) => inv.id === id);
			info.action_plan[index].daily = !info.action_plan[index].daily;
			return info;
		});
	}
};

// Function to mark only done or repeated items in action plan
export const markOnlyDoneOrRepeatedItems = (
	id: string,
	problemType: ProblemType,
	done: boolean
) => {
	if (problemType === ProblemType.action_plan) {
		problemInfo.update((info) => {
			const index = info.action_plan.findIndex((inv) => inv.id === id);
			if (done) {
				info.action_plan[index].done = !info.action_plan[index].done;
				info.action_plan[index].repeatable = false;
			} else {
				info.action_plan[index].done = false;
				info.action_plan[index].repeatable = !info.action_plan[index].repeatable;
			}
			return info;
		});
	}
};
