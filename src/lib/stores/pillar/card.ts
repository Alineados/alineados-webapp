import type { PillarsAndCategories, Categories } from '$lib/interfaces/Pillar.interface';
import { derived, writable } from 'svelte/store';

// Almacenamos las categorías para cada pilar
export const healthCategories = writable<Categories[]>([]);
export const relationalCategories = writable<Categories[]>([]);
export const vocationalCategories = writable<Categories[]>([]);
export const spiritualCategories = writable<Categories[]>([]);

// Store para el filtro. Los posibles valores son: "all", "active" y "inactive"
export const filterBy = writable<string>("all");

// Derived stores para filtrar las categorías según el valor de filterBy
export const healthCategoriesFiltered = derived(
	[healthCategories, filterBy],
	([$healthCategories, $filterBy]) => {
		return $healthCategories.filter(cat => {
			if ($filterBy === "active") return cat.active;
			else if ($filterBy === "inactive") return !cat.active;
			else return true;
		});
	}
);

export const relationalCategoriesFiltered = derived(
	[relationalCategories, filterBy],
	([$relationalCategories, $filterBy]) => {
		return $relationalCategories.filter(cat => {
			if ($filterBy === "active") return cat.active;
			else if ($filterBy === "inactive") return !cat.active;
			else return true;
		});
	}
);

export const vocationalCategoriesFiltered = derived(
	[vocationalCategories, filterBy],
	([$vocationalCategories, $filterBy]) => {
		return $vocationalCategories.filter(cat => {
			if ($filterBy === "active") return cat.active;
			else if ($filterBy === "inactive") return !cat.active;
			else return true;
		});
	}
);

export const spiritualCategoriesFiltered = derived(
	[spiritualCategories, filterBy],
	([$spiritualCategories, $filterBy]) => {
		return $spiritualCategories.filter(cat => {
			if ($filterBy === "active") return cat.active;
			else if ($filterBy === "inactive") return !cat.active;
			else return true;
		});
	}
);

// Función para inicializar los stores con la data de pilares
export const initPillars = (pillars: PillarsAndCategories) => {
	if (pillars.health) healthCategories.set(pillars.health.categories);
	if (pillars.relational) relationalCategories.set(pillars.relational.categories);
	if (pillars.vocational) vocationalCategories.set(pillars.vocational.categories);
	if (pillars.spiritual) spiritualCategories.set(pillars.spiritual.categories);
};

// Función para actualizar el estado de una categoría específica
export const updateCategoryState = (pillarType: string, categoryId: string, active: boolean) => {
	let store;
	
	switch (pillarType) {
		case 'health':
			store = healthCategories;
			break;
		case 'relational':
			store = relationalCategories;
			break;
		case 'vocational':
			store = vocationalCategories;
			break;
		case 'spiritual':
			store = spiritualCategories;
			break;
		default:
			return;
	}
	
	store.update(categories => 
		categories.map(cat => 
			cat.id === categoryId 
				? { ...cat, active } 
				: cat
		)
	);
};
