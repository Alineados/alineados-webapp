import type { PillarsAndCategories } from "./Pillar.interface";


export const Pillars: PillarsAndCategories = {
	health: {
		id: '1',
		name: 'health',
		label: 'Salud',
		categories: [
			{
				id: '1',
				label: 'Física',
				name: 'physical',
				active: true
			},
			{
				id: '2',
				label: 'Mental',
				name: 'mental',
				active: false
			}
		]
	},
	relational: {
		id: '2',
		label: 'Relaciones',
		name: 'relational',
		categories: [
			{
				id: '1',
				label: 'Propias',
				name: 'own',
				active: true
			},
			{
				id: '2',
				label: 'Familiar',
				name: 'family',
				active: true
			},
			{
				id: '3',
				label: 'Amorosa',
				name: 'love',
				active: true
			},
			{
				id: '4',
				label: 'Amigos',
				name: 'friends',
				active: false
			},
			{
				id: '5',
				label: 'Conocidos',
				name: 'acquaintances',
				active: true
			},
			{
				id: '6',
				label: 'Desconocidos',
				name: 'strangers',
				active: true
			}
		]
	},
	vocational: {
		id: '3',
		label: 'Vocaciones',
		name: 'vocational',
		categories: [
			{
				id: '1',
				label: 'Estudios',
				name: 'studies',
				active: true
			},
			{
				id: '2',
				label: 'Pasatiempos',
				name: 'hobbies',
				active: true
			},
			{
				id: '3',
				label: 'Trabajo Propio',
				name: 'ownWork',
				active: true
			},
			{
				id: '4',
				label: 'Trabajo Terceros',
				name: 'thirdPartyWork',
				active: false
			},
			{
				id: '5',
				label: 'Bienes Materiales',
				name: 'materialGoods',
				active: true
			}
		]
	},
	spiritual: {
		id: '4',
		name: 'spiritual',
		label: 'Espiritual',
		categories: [
			{
				id: '1',
				label: 'Espiritual',
				name: 'spiritual',
				active: true
			}
		]
	}
};
