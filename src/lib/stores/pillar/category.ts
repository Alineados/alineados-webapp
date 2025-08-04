import { writable } from 'svelte/store';
import type { CategoryDTO } from '$lib/services/personal/pillars';

// Store para el estado de carga de actualización
export const isUpdatingCategory = writable(false);

// Store para mensajes de error/éxito
export const categoryUpdateMessage = writable<{
	type: 'success' | 'error' | null;
	message: string;
}>({ type: null, message: '' });

// Store para la categoría actual que se está editando
export const currentEditingCategory = writable<CategoryDTO | null>(null);

// Store global para el estado de guardado de pillars
export const isPillarSaving = writable(false); 