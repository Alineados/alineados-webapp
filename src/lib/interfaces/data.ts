interface PillarsAndCategories {
	health: Data;
	relational: Data;
	vocational: Data;
	spiritual: Data;
}

interface Data {
	id: string;
	name: string;
	categories: Categories[];
}

export interface Categories {
	id: string;
	name: string;
	active: boolean;
}

export const Pillars: PillarsAndCategories = {
	health: {
		id: '1',
		name: 'Salud',
		categories: [
			{
				id: '1',
				name: 'Física',
				active: true
			},
			{
				id: '2',
				name: 'Mental',
				active: false
			}
		]
	},
	relational: {
		id: '2',
		name: 'Relaciones',
		categories: [
			{
				id: '1',
				name: 'Propias',
				active: true
			},
			{
				id: '2',
				name: 'Familiar',
				active: true
			},
			{
				id: '3',
				name: 'Amorosa',
				active: true
			},
			{
				id: '4',
				name: 'Amigos',
				active: false
			},
			{
				id: '5',
				name: 'Conocidos',
				active: true
			},
			{
				id: '6',
				name: 'Desconocidos',
				active: true
			}
		]
	},
	vocational: {
		id: '3',
		name: 'Vocaciones',
		categories: [
			{
				id: '1',
				name: 'Estudios',
				active: true
			},
			{
				id: '2',
				name: 'Pasatiempos',
				active: true
			},
			{
				id: '3',
				name: 'Trabajo Propio',
				active: true
			},
			{
				id: '4',
				name: 'Trabajo Terceros',
				active: false
			},
			{
				id: '5',
				name: 'Bienes Materiales',
				active: true
			}
		]
	},
	spiritual: {
		id: '4',
		name: 'Espiritual',
		categories: [
			{
				id: '1',
				name: 'Espiritual',
				active: true
			}
		]
	}
};
