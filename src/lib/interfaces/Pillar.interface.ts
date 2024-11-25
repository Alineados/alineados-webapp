export interface PillarItems {
  name: string;
  value: number;
}

export interface PillarsAndCategories {
	health: DataPillar;
	relational: DataPillar;
	vocational: DataPillar;
	spiritual: DataPillar;
}

export interface DataPillar {
	id: string;
	name: string;
	categories: Categories[];
}

export interface Categories {
	id: string;
	name: string;
	active: boolean;
}