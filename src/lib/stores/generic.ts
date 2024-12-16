import type { CellMatrix, Generic, MatrixRow } from '$lib/interfaces';
import { v4 as uuidv4 } from 'uuid';

export const emptyGeneric = (): Generic => {
	return {
		id: uuidv4(),
		description: '',
		created_at: new Date().toISOString(),
		deleted: false,
		prominent: false,
		repeatable: false,
		daily: false
	};
};

export const generateNewMatrixRow = (): MatrixRow => {
	return {
		id: uuidv4(),
		objective: '',
		percentage: 0,
		units: '#',
		cells: [
			{ ...generateNewMatrixCell() },
			{ ...generateNewMatrixCell() },
			{ ...generateNewMatrixCell() }
		]
	};
};

export const generateNewMatrixCell = (): CellMatrix => {
	return {
		id: uuidv4(),
		value: 0,
		reference_value: '##',
		winner: false
	};
};
