
export interface Documents {
	id: string;
	path: string;
	description: string;
}

export interface Generic {
	id: string;
	created_at: string;
	description: string;
	deleted: boolean;
	prominent: boolean;
	repeatable: boolean;
	done: boolean;
	daily: boolean;
}


export enum FilterBy {
	ALL = 'all',
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	FINISHED = 'finished',
}


export interface Selector {
	id: number;
	key: string;
	value: number;
	disabled: boolean;
}
