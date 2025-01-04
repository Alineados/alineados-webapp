import type {
	CellMatrix,
	Generic,
	Matrix,
	MatrixColl,
	MatrixResult,
	MatrixRow
} from '$lib/interfaces';

import { expose } from 'comlink';
import { v4 as uuidv4 } from 'uuid';

export interface MatrixWorker {
	addAlternative(alternatives: Generic[], oldMatrix: Matrix): Matrix;
	deleteAlternative(id: string, oldMatrix: Matrix): Matrix;
	addObjective(objectives: Generic[], oldMatrix: Matrix): Matrix;
	deleteObjective(id: string, oldMatrix: Matrix): Matrix;
	calculateResults(matrix: Matrix): Matrix;
}

const api = {
	calculateResults(matrix: Matrix): Matrix {
		let results: MatrixResult = {
			id: uuidv4(),
			name: 'resultados',
			results: [],
			winner: 0
		};

		// iterate over the rows and sum the values of the cells
		for (let i = 0; i < matrix.rows.length; i++) {
			// sum and assign the value to the row
			for (let c = 0; c < matrix.cols.length; c++) {
				if (results.results[c] === undefined) results.results[c] = 0;
				if (matrix.rows[i].cells[c].value !== '') {
					let number = parseInt(matrix.rows[i].cells[c].value);

					if (isNaN(number)) {
						number = 0;
					} else if (number <= 0 || number > 3) {
						number = 0;
					} else results.results[c] += number;
				}
			}
		}

		// if all values are 0, set -1 to the winner
		if (results.results.every((value) => value === 0)) results.winner = -1;
		// check if there is a tie
		else if (results.results.every((value) => value === results.results[0])){
			// get the object row with the highest percentage
			const maxPercentage = Math.max(...matrix.rows.map((row) => row.percentage));
			const maxPercentageRow = matrix.rows.find((row) => row.percentage === maxPercentage);

			const cells = maxPercentageRow?.cells.map((cell) => parseInt(cell.value) || 0);
			if(cells) results.winner = cells.indexOf(Math.max(...cells));
		}
		else results.winner = results.results.indexOf(Math.max(...results.results)); // get the index of the max value in the array

		matrix.results = results;

		return matrix;
	},

	// Alternatives change
	addAlternative(objectives: Generic[], alternatives: Generic[], oldMatrix: Matrix): Matrix {
		alternatives.forEach((alternative) => {
			// find the alternative in the cols
			const index = oldMatrix.cols.findIndex((col) => col.aid === alternative.id);
			// update the alternative description
			if (index !== -1) {
				oldMatrix.cols[index].name = alternative.description;
			} else {
				if (alternative.description !== '') {
					oldMatrix.cols.push(this.generateNewMatrixColl(alternative.id, alternative.description));
				}

				// update the cells inside the rows of matrix
				oldMatrix.rows.forEach((row) => {
					const index = row.cells.findIndex((cell) => cell.oid === alternative.id);
					if (index === -1) {
						if (alternative.description === '') return;
						row.cells.push({
							oid: alternative.id,
							value: '0',
							reference_value: '##'
						});
					}
				});
			}
		});

		oldMatrix = this.calculateResults(oldMatrix);

		return oldMatrix;
	},
	deleteAlternative(id: string, oldMatrix: Matrix): Matrix {
		oldMatrix.cols = oldMatrix.cols.filter((col) => col.aid !== id);

		// delete the cells inside the rows of matrix
		oldMatrix.rows.forEach((row) => {
			row.cells = row.cells.filter((cell) => cell.oid !== id);
		});

		if (oldMatrix.cols.length === 0) oldMatrix.results = null;
		else oldMatrix = this.calculateResults(oldMatrix);

		return oldMatrix;
	},

	// Objectives change
	addObjective(objectives: Generic[], alternatives: Generic[], oldMatrix: Matrix): Matrix {
		// 1. iterate over the objectives
		objectives.forEach((objective) => {
			if (objective.description !== '') {
				const index = oldMatrix.rows.findIndex((row) => row.oid === objective.id);
				if (index !== -1) oldMatrix.rows[index].name = objective.description;
				// 2. Overwrite the rows with the new objectives
				else
					oldMatrix.rows.push(
						this.generateNewMatrixRow(alternatives, objective.id, objective.description)
					);
			}
		});

		oldMatrix = this.calculateResults(oldMatrix);

		return oldMatrix;
	},
	deleteObjective(id: string, oldMatrix: Matrix): Matrix {
		oldMatrix.rows = oldMatrix.rows.filter((row) => row.oid !== id);

		if (oldMatrix.rows.length === 0) oldMatrix.results = null;
		else oldMatrix = this.calculateResults(oldMatrix);

		return oldMatrix;
	},

	// Functions to generate new rows and cells
	generateNewMatrixRow(cols: Generic[], id?: string, name?: string): MatrixRow {
		return {
			oid: id || '',
			name: name || '',
			key: '',
			percentage: 0,
			cells: this.generateMatrixCell(cols),
			units: 'unidades de medida'
		};
	},

	generateNewMatrixColl(id?: string, name?: string): MatrixColl {
		return {
			aid: id || uuidv4(),
			name: name || ''
		};
	},

	generateMatrixCell(cols: Generic[]): CellMatrix[] {
		let cells: CellMatrix[] = [];

		for (let i = 0; i < cols.length; i++) {
			if (cols[i].description === '') continue;
			cells.push({
				oid: cols[i].id,
				value: '0',
				reference_value: '##'
			});
		}

		return cells;
	}
};

expose(api);
