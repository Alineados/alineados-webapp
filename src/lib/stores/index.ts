// problems
export {
	initProblems,
	initProblemCard,
	addProblem,
	removeProblem,
	updateSecurityAndActive,
	updateProblemName,
	isCompleteProblem,
	problemProgress,
	filterBy,
	healthProblems,
	relationalProblems,
	spiritualProblems,
	vocationalProblems,
	autosavingProblemCard,
	problemCard,
	pcid,
	problemCardJSON,
	healthProblemsFiltered,
	relationalProblemsFiltered,
	spiritualProblemsFiltered,
	vocationalProblemsFiltered,
	syncProblemCardToStores
} from './problem/cards';

export {
	initProblemInfo,
	addProblemItem,
	removeOrCleanItem,
	prominentItem,
	changeFinalDecisionAndRecommended,
	markDailytItem,
	markOnlyDoneOrRepeatedItems,
	changeCompleteStatus,
	changeReportProblem,
	addMemory,
	removeMemory,
	initImages,
	problemsImages,
	reportProblem,
	problemReadyToComplete,
	autosavingProblemInfo,
	pid,
	problemInfo,
	problemInfoJSON
} from './problem/info';

export {
	initMatrix,
	getSelectorList,
	autosavingProblemMatrix,
	matrixJSON,
	matrix
} from './problem/matrix';

// New type of stores
export { userState } from './user/info.svelte';
export { pillarState, PillarState } from './user/pillars.svelte';
export { storyState } from './personal/story/story.svelte';
export { thoughtState } from './personal/thought/thought.svelte';
export { storiesState } from './personal/story/stories.svelte';
export { thoughtsState } from './personal/thought/thoughts.svelte';
export { purposesState } from './user/purposes.svelte';

// Generics
export { emptyGeneric, listSelector } from './generic';

export { infoState } from "./settings/info.svelte"

// Professional pillars autosave functionality
export {
	autosavingPillars,
	pillarsCategoryInfoJSON,
	currentCategoryInfo,
	isPillarSaving,
	currentCategoryActive,
	hasCategoryContent,
	updateCategoryStateBasedOnContent,
	autosaveStatus,
	lastSavedAt,
	saveImmediately,
	saveSynchronously,
	setDataLoaded
} from './pillar';

