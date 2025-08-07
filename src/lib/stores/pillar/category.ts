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
export const autosaveStatus = writable<'idle' | 'saving' | 'saved' | 'error'>('idle');
export const lastSavedAt = writable<Date | null>(null);

// Simple debounce implementation
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	return (...args: Parameters<T>) => {
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		debounceTimeout = setTimeout(() => func(...args), delay);
	};
}

// Función para obtener los parámetros necesarios
function getRequiredParams() {
	const pageParams = JSON.parse(localStorage.getItem('pageParams') || '{}');
	const userStateData = JSON.parse(localStorage.getItem('userState') || '{}');
	const token = localStorage.getItem('token') || '';
	
	return {
		pillar: pageParams.pillar,
		category: pageParams.category,
		userId: userStateData.id,
		token
	};
}

// Función centralizada para guardar
async function saveCategoryInfo(categoryInfo: CategoryInfoDTO): Promise<boolean> {
	const { pillar, userId, token } = getRequiredParams();
	
	if (!userId || !pillar) {
		console.log('Missing required data for autosave');
		return false;
	}

	try {
		const response = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/update-category-info?pillar=${pillar}`, {
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
			return true;
		} else {
			console.error('Autosave failed:', response.status);
			autosaveStatus.set('error');
			return false;
		}
	} catch (error) {
		console.error('Error in autosave:', error);
		autosaveStatus.set('error');
		return false;
	}
}

// Función debounced para autosave
const debouncedSave = debounce(async (categoryInfo: CategoryInfoDTO) => {
	// Verificar si hay contenido real para guardar
	const hasRealContent = Object.values(categoryInfo).some(value => {
		if (Array.isArray(value)) {
			return value.some(item => item && item.description && item.description.trim() !== '');
		}
		return false;
	});
	
	if (!hasRealContent) {
		console.log('No real content to save, skipping');
		return;
	}
	
	console.log('debouncedSave called with categoryInfo:', categoryInfo);
	autosaveStatus.set('saving');
	const success = await saveCategoryInfo(categoryInfo);
	if (!success) {
		// En caso de error, intentar una vez más después de 2 segundos
		setTimeout(async () => {
			await saveCategoryInfo(categoryInfo);
		}, 2000);
	}
}, 1500); // 1.5 segundos de debounce

// Función para actualizar el store global y trigger autosave
export function updateCategoryInfoAndSave(updates: Partial<CategoryInfoDTO>) {
	const currentInfo = get(currentCategoryInfo);
	
	if (!currentInfo) {
		console.warn('No current category info available');
		return;
	}
	
	// Verificar si los datos realmente cambiaron
	const hasChanges = Object.keys(updates).some(key => {
		const currentValue = currentInfo[key as keyof CategoryInfoDTO];
		const newValue = updates[key as keyof CategoryInfoDTO];
		return JSON.stringify(currentValue) !== JSON.stringify(newValue);
	});
	
	if (!hasChanges) {
		console.log('No changes detected, skipping update');
		return;
	}
	
	console.log('updateCategoryInfoAndSave called with:', updates);
	
	// Actualizar el store
	const updatedInfo = { ...currentInfo, ...updates };
	currentCategoryInfo.set(updatedInfo);
	
	// Trigger autosave
	debouncedSave(updatedInfo);
}

// Función para guardar inmediatamente (al perder foco)
export async function saveImmediately() {
	const categoryInfo = get(currentCategoryInfo);
	if (!categoryInfo) return;

	autosaveStatus.set('saving');
	const success = await saveCategoryInfo(categoryInfo);
	
	if (!success) {
		autosaveStatus.set('error');
	}
}

// Función para guardar síncronamente (antes de salir)
export function saveSynchronously() {
	const categoryInfo = get(currentCategoryInfo);
	if (!categoryInfo) return;

	try {
		const { pillar, token } = getRequiredParams();
		
		if (!pillar) return;

		// Usar XMLHttpRequest síncrono para asegurar que se complete antes de salir
		const xhr = new XMLHttpRequest();
		const url = `${getEndpointByVenv().pillars}/api/v1/pillars/update-category-info?pillar=${pillar}`;
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