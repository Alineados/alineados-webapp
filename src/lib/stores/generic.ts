import type { GenericOne, GenericThree, GenericTwo } from '$lib/interfaces';
import { v4 as uuidv4 } from 'uuid';


export const emptyGenericTwo = (): GenericTwo => {
	return {
		id: uuidv4(),
		description: '',
		createdAt: new Date().toISOString(),
		deleted: false,
		prominent: false
	};
};

export const emptyGenericOne = (): GenericOne => {
	return {
		id: uuidv4(),
		description: '',
		createdAt: new Date().toISOString(),
		deleted: false
	};
};

export const emptyGenericThree = (): GenericThree => {
	return {
		id: uuidv4(),
		description: '',
		createdAt: new Date().toISOString(),
		deleted: false,
		prominent: false,
		repeatable: false
	};
};