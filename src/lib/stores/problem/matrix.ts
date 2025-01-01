import type { Matrix, MatrixRow, Selector } from '$lib/interfaces';
import { derived, writable } from 'svelte/store';
import { listSelector } from '../generic';

export const matrix = writable<Matrix>();
// export const rows = writable<MatrixRow[]>([]);

// Function to initialize the store with the matrix
export const initMatrix = (matrixData: Matrix) => {
	if (matrixData) matrix.set(matrixData);
};

// Function to return a list of values
export function getSelectorList(rows: MatrixRow[]): Selector[] {
	const total = 100;

	let objectivesNumber = rows.length;

	if (objectivesNumber === 1) {
		listSelector[0].value = total;
		return listSelector.slice(3, 4);
	} else if (objectivesNumber === 2) {
		listSelector[1].value = 45;
		listSelector[3].value = 55;
		// only return 1 and 3
		return listSelector.filter((_, index) => index === 1 || index === 3);
	} else if (objectivesNumber === 3) {
		listSelector[1].value = 25;
		listSelector[2].value = 35;
		listSelector[3].value = 45;
		return listSelector.slice(1, 4);
	} else if (objectivesNumber === 4) {
		listSelector[0].value = 10;
		listSelector[1].value = 20;
		listSelector[2].value = 30;
		listSelector[3].value = 40;
		return listSelector.slice(0, 4);
	} else if (objectivesNumber === 5) {
		listSelector[0].value = 10;
		listSelector[1].value = 15;
		listSelector[2].value = 25;
		listSelector[3].value = 35;
		listSelector[4].value = 45;
		return listSelector;
	}

	return listSelector;
}

// autosave
let timeoutId: number;
let endTimeoutId: number;
export const autosavingProblemMatrix = derived([matrix], (_, set) => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(() => {
		set(true);
		endTimeoutId = setTimeout(() => {
			set(false);
			clearTimeout(endTimeoutId);
		}, 1000);
	}, 1000);
});

export const matrixJSON = derived([matrix], ([$matrix], set) => {
	set(JSON.stringify($matrix));
});
