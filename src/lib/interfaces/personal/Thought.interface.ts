import type { Documents, TypeEditable } from '../Generics.interface';

// DTOS
export interface ThoughtUpdate {
	// ids
	pfid: string; // pillar info id
	ppid: string; // purpose pillar id

	// properties
	thought_name: string;
	pillar_name: string;
	purpose_name: string;
	quality_time: TypeEditable;
	is_important: boolean;
}

export interface ThoughtDocumentWithUrl {
	document: Documents;
	url: string;
}

// MODELS

export interface Thought {
	// ids
	id: string;
	uid: string; // user id
	pfid: string; // pillar info id
	ppid: string; // purpose pillar id

	// properties
	thought_name: string;
	pillar_name: string;
	purpose_name: string;
	quality_time: TypeEditable;

	// secondary properties
	is_important: boolean;
	created_at: string;
	updated_at?: string;
	deleted_at?: string;
}