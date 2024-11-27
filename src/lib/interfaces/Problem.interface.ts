import type { Documents, GenericThree, GenericTwo } from './index';

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
	decision_taken: GenericTwo | null;
	problem: GenericTwo | null;
	solved: boolean;
	involved: GenericTwo[];
	contexts: GenericTwo[];
	objectives: GenericTwo[];
	alternatives: GenericTwo[];
	action_plan: GenericThree[];
	memories: Documents[];
	createdAt: string;
	updatedAt: string | null;
}
