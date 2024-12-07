
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
	daily: boolean;
}
// export interface GenericOne {
// 	id: string;
// 	createdAt: string;
// 	description: string;
// 	deleted: boolean;
// }

// export interface GenericTwo {
// 	id: string;
// 	createdAt: string;
// 	description: string;
// 	deleted: boolean;
// 	prominent: boolean;
// }
