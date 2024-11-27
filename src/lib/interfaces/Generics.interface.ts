export interface GenericOne {
	id: string;
	createdAt: string;
	description: string;
	deleted: boolean;
}

export interface GenericTwo {
	id: string;
	createdAt: string;
	description: string;
	deleted: boolean;
	prominent: boolean;
}

export interface Documents {
	id: string;
	path: string;
	description: string;
}

export interface GenericThree {
	id: string;
	createdAt: string;
	description: string;
	deleted: boolean;
	prominent: boolean;
	repeatable: boolean;
}
