import { writable, get, derived } from 'svelte/store';
import type { CategoryDTO, CategoryInfoDTO, GenericItemDTO } from '$lib/services/personal/pillars';
import { getEndpointByVenv } from '$lib/services/endpoints';

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

// Store para la información de categoría actual
export const currentCategoryInfo = writable<CategoryInfoDTO | null>(null);
export const currentCategoryActive = writable<boolean>(false);

// Store para el estado de guardado de secciones específicas
export const isSectionSaving = writable<{
	section: string;
	saving: boolean;
}>({ section: '', saving: false });

// PROFESSIONAL AUTOSAVE SYSTEM
let debounceTimeout: ReturnType<typeof setTimeout>;
let retryCount = 0;
const MAX_RETRIES = 3;
let isAutosaving = false; // Flag para evitar bucle infinito
let isDataLoaded = false; // Flag para indicar si los datos están cargados

// Estado del autosave
export const autosaveStatus = writable<'idle' | 'saving' | 'saved' | 'error'>('idle');
export const lastSavedAt = writable<Date | null>(null);

// Función para marcar que los datos están cargados
export function setDataLoaded(loaded: boolean) {
	isDataLoaded = loaded;
}

// TEMPORARILY DISABLED - Debounce inteligente - similar a Notion
export const autosavingPillars = derived([currentCategoryInfo], (_, set) => {
	// TEMPORARILY DISABLED - Comentado para evitar bucle infinito
	/*
	// Evitar bucle infinito
	if (isAutosaving) return;
	
	// Solo ejecutar si hay datos reales y están cargados
	const categoryInfo = get(currentCategoryInfo);
	if (!categoryInfo || !categoryInfo.cid || !isDataLoaded) return;
	
	clearTimeout(debounceTimeout);
	
	// Cambiar estado a 'saving' inmediatamente
	set(true);
	autosaveStatus.set('saving');
	
	// Debounce de 1.5 segundos
	debounceTimeout = setTimeout(() => {
		saveCategoryInfoSilent();
	}, 1500);
	*/
	
	// TEMPORARILY DISABLED - No hacer nada
	set(false);
});

export const pillarsCategoryInfoJSON = derived([currentCategoryInfo], ([$currentCategoryInfo], set) => {
	// TEMPORARILY DISABLED - No hacer nada
	// set(JSON.stringify($currentCategoryInfo));
	set('');
});

// Función centralizada para guardar silenciosamente
async function saveCategoryInfoSilent() {
	const categoryInfo = get(currentCategoryInfo);
	if (!categoryInfo) return;

	isAutosaving = true; // Marcar que estamos autosaveando

	try {
		// Obtener parámetros necesarios
		const pageParams = JSON.parse(localStorage.getItem('pageParams') || '{}');
		const userStateData = JSON.parse(localStorage.getItem('userState') || '{}');
		const token = localStorage.getItem('token') || '';
		
		if (!userStateData.id || !pageParams.pillar || !pageParams.category) {
			console.log('Missing required data for autosave');
			isAutosaving = false;
			return;
		}

		const response = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/update-category-info?pillar=${pageParams.pillar}`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization': `Bearer ${token}` 
			},
			body: JSON.stringify(categoryInfo)
		});

		if (response.ok) {
			console.log('Autosave successful');
			autosaveStatus.set('saved');
			lastSavedAt.set(new Date());
			retryCount = 0; // Reset retry count on success
			
			// Actualizar automáticamente el estado de la categoría
			await updateCategoryStateBasedOnContent(
				pageParams.pillar, 
				categoryInfo.cid, 
				userStateData.id, 
				token
			);
		} else {
			console.error('Autosave failed:', response.status);
			autosaveStatus.set('error');
			
			// Reintentar automáticamente
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				console.log(`Retrying autosave (${retryCount}/${MAX_RETRIES})...`);
				setTimeout(() => saveCategoryInfoSilent(), 2000 * retryCount); // Backoff exponencial
			}
		}
	} catch (error) {
		console.error('Error in autosave:', error);
		autosaveStatus.set('error');
		
		// Reintentar automáticamente
		if (retryCount < MAX_RETRIES) {
			retryCount++;
			console.log(`Retrying autosave (${retryCount}/${MAX_RETRIES})...`);
			setTimeout(() => saveCategoryInfoSilent(), 2000 * retryCount);
		}
	} finally {
		isAutosaving = false; // Resetear el flag
	}
}

// Función para guardar inmediatamente (al perder foco)
export async function saveImmediately() {
	const categoryInfo = get(currentCategoryInfo);
	if (!categoryInfo) return;

	autosaveStatus.set('saving');
	
	try {
		const pageParams = JSON.parse(localStorage.getItem('pageParams') || '{}');
		const userStateData = JSON.parse(localStorage.getItem('userState') || '{}');
		const token = localStorage.getItem('token') || '';
		
		if (!userStateData.id || !pageParams.pillar || !pageParams.category) return;

		const response = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/update-category-info?pillar=${pageParams.pillar}`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization': `Bearer ${token}` 
			},
			body: JSON.stringify(categoryInfo)
		});

		if (response.ok) {
			autosaveStatus.set('saved');
			lastSavedAt.set(new Date());
			console.log('Immediate save successful');
		} else {
			autosaveStatus.set('error');
			console.error('Immediate save failed:', response.status);
		}
	} catch (error) {
		console.error('Error in immediate save:', error);
		autosaveStatus.set('error');
	}
}

// Función para guardar síncronamente (antes de salir)
export function saveSynchronously() {
	const categoryInfo = get(currentCategoryInfo);
	if (!categoryInfo) return;

	try {
		const pageParams = JSON.parse(localStorage.getItem('pageParams') || '{}');
		const userStateData = JSON.parse(localStorage.getItem('userState') || '{}');
		const token = localStorage.getItem('token') || '';
		
		if (!userStateData.id || !pageParams.pillar || !pageParams.category) return;

		// Usar XMLHttpRequest síncrono para asegurar que se complete antes de salir
		const xhr = new XMLHttpRequest();
		const url = `${getEndpointByVenv().pillars}/api/v1/pillars/update-category-info?pillar=${pageParams.pillar}`;
		xhr.open('POST', url, false); // false = síncrono
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Authorization', `Bearer ${token}`);
		xhr.send(JSON.stringify(categoryInfo));
		
		console.log('Synchronous save completed');
	} catch (error) {
		console.error('Error in synchronous save:', error);
	}
}

// Función para verificar si una categoría tiene contenido
export function hasCategoryContent(categoryInfo: CategoryInfoDTO | null): boolean {
    if (!categoryInfo) return false;
    
    const sections = [
        categoryInfo.elements,
        categoryInfo.objectives,
        categoryInfo.positive_actions,
        categoryInfo.improve_actions,
        categoryInfo.habits,
        categoryInfo.short_actions,
        categoryInfo.middle_actions,
        categoryInfo.long_actions
    ];
    
    return sections.some(section => section && section.length > 0);
}

// Función para actualizar el estado de la categoría basado en su contenido
export async function updateCategoryStateBasedOnContent(
    pillar: string, categoryId: string, userId: string, token: string
) {
    const categoryInfo = get(currentCategoryInfo);
    const hasContent = hasCategoryContent(categoryInfo);
    console.log(`Updating category state - Pillar: ${pillar}, CategoryId: ${categoryId}, HasContent: ${hasContent}`);
    try {
        const response = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/update-category-state?pillar=${pillar}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ cid: categoryId, uid: userId, active: hasContent })
        });
        if (response.ok) {
            console.log(`Categoría ${hasContent ? 'activada' : 'desactivada'} automáticamente`);
            // Actualizar el store del estado activo
            currentCategoryActive.set(hasContent);
        } else {
            console.error('Error response:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error updating category state:', error);
    }
} 