import type { Generic, Selector } from '$lib/interfaces';
import { v4 as uuidv4 } from 'uuid';

export const emptyGeneric = (): Generic => {
	return {
		id: uuidv4(),
		description: '',
		created_at: new Date().toISOString(),
		deleted: false,
		prominent: false,
		repeatable: false,
		done: false,
		daily: false
	};
};

export const listSelector: Selector[] = [
	{
		id: 1,
		key: 'Muy Baja',
		value: 0
	},
	{
		id: 2,
		key: 'Baja',
		value: 0
	},
	{
		id: 3,
		key: 'Media',
		value: 0
	},
	{
		id: 4,
		key: 'Alta',
		value: 0
	},
	{
		id: 5,
		key: 'Muy Alta',
		value: 0
	}
];
