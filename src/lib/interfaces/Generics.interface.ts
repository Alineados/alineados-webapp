
export interface Documents {
	id: string;
	path: string;
	file_name: string;
	content: string | null;
	type: string;
	created_at: string;
}

export interface Images {
	id: string;
	path : string;
	file_name: string;
	created_at: string;
}

export interface Url {
	id: string;
	url: string;
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

export interface TypeEditable {
	id: string;
	text: string | null ;
	audio: Documents | null;
	documents: Documents[];
}
