import type { Documents, Generic, Images } from './index';

export interface ProblemCard {
	// ids
	id: string; // corresponds to primitive.ObjectID in Go
	uid: string; // user id
	pfid: string; // pillar info id
	cid: string; // category id

	// properties
	problem_name: string;
	category_name: string;
	pillar_name: string;
	milestone_date: string;
	progress: number;
	active: boolean;
	security: boolean;

	// hidden properties
	is_new: boolean;
	created_at: string;
	updated_at?: string;
	deleted_at?: string;
	completed_at?: string | null;
}

export interface ProblemInfo {
	id: string; // primitive.ObjectID in Go
	pid: string; // problem id
	solved: boolean;
	decision_taken: Generic | null;
	problem: Generic | null;
	involved: Generic[];
	contexts: Generic[];
	objectives: Generic[];
	alternatives: Generic[];
	action_plan: Generic[];
	memories: Documents[];
	final_decision: string | null; // will save the id of the objective selected
	recommended_decision: string | null; // will save the id of the objective selected
	created_at: string;
	updated_at: string | null;
}

export interface Matrix {
	id: string; // primitive.ObjectID in Go
	pid: string; // problem id
	pfd: string; // problem info id
	uid: string; // user id
	rows: MatrixRow[];
	cols: MatrixColl[];
	results: MatrixResult | null;
	created_at: string;
	updated_at: string | null;
}

export interface MatrixResult {
	id: string; // id
	name: string;
	results: number[];
	winner: number;
}

export interface MatrixRow {
	oid: string; // objective id
	name: string;
	percentage: number;
	key: string;
	units: string;
	cells: CellMatrix[];
}

export interface MatrixColl {
	aid: string; // alternative id
	name: string;
}

export interface CellMatrix {
	oid: string; // objective id
	value: string;
	reference_value: string;
}

export enum ProblemType {
	decision_taken = 'Tomador de decisión',
	problem = 'Problema',
	involved = 'Involucrados',
	contexts = 'Contexto',
	objectives = 'Objetivos',
	alternatives = 'Alternativas',
	action_plan = 'Plan de acción'
}
