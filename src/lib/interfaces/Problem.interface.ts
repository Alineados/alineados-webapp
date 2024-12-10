import type { Documents, Generic } from './index';

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
	milestone_date: Date;
	progress: number;
	active: boolean;
	security: boolean;

	// hidden properties
	is_new: boolean;
	created_at: string;
	updated_at?: string;
	deleted_at?: string;
	completed_at?: string;
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
	created_at: string;
	updated_at: string | null;
}

export enum ProblemType {
	decision_taken = 'Tomador de decisión',
	problem = 'Problema',
	involved = 'Involucrados',
	contexts = 'Contexto',
	objectives = 'Objetivos',
	alternatives = 'Alternativas',
	action_plan = 'Plan de acción',
}
