import type { Generic } from '$lib/interfaces';
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

// export const emptyGenericTwo = (): GenericTwo => {
// 	return {
// 		id: uuidv4(),
// 		description: '',
// 		createdAt: new Date().toISOString(),
// 		deleted: false,
// 		prominent: false
// 	};
// };

// export const emptyGenericOne = (): GenericOne => {
// 	return {
// 		id: uuidv4(),
// 		description: '',
// 		createdAt: new Date().toISOString(),
// 		deleted: false
// 	};
// };

