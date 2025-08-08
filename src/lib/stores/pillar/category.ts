import { writable, get, derived } from 'svelte/store';
import type { CategoryDTO, CategoryInfoDTO, GenericItemDTO } from '$lib/services/personal/pillars';
import { getEndpointByVenv } from '$lib/services/endpoints';
import { updateCategoryState } from './card';
import { invalidateAll } from '$app/navigation';

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

// Store para la información de categoría actual (específica por categoría)
export const currentCategoryInfo = writable<CategoryInfoDTO | null>(null);

// Store para el ID de la categoría actual
export const currentCategoryId = writable<string>('');

// Sistema de inicialización global por categoría
let initializedCategories = new Set<string>();
let categoryInitializationPromises = new Map<string, Promise<string | null>>();
let creatingDocument = false; // Flag global para prevenir múltiples creaciones simultáneas

// Función para normalizar el categoryId - SIEMPRE usar el valor de la URL
function normalizeCategoryId(categoryId: string): string {
	// Simplemente retornar el categoryId tal como viene (ya debería ser consistente)
	console.log(`🔄 Normalizing categoryId: ${categoryId} -> ${categoryId}`);
	return categoryId;
}

// Nueva función para asegurar que una categoría esté completamente inicializada
export async function ensureCategoryInitialized(categoryId: string): Promise<string | null> {
	const normalizedId = normalizeCategoryId(categoryId);
	console.log(`🎯 ensureCategoryInitialized called for categoryId: ${categoryId} (normalized: ${normalizedId})`);
	console.log(`🎯 Stack trace:`, new Error().stack);
	console.log(`🎯 Current initializedCategories:`, Array.from(initializedCategories));
	console.log(`🎯 Current categoryInitializationPromises:`, Array.from(categoryInitializationPromises.keys()));
	
	// Si ya está inicializada Y el store tiene el ID, retornar inmediatamente
	if (initializedCategories.has(normalizedId)) {
		const currentInfo = get(currentCategoryInfo);
		const currentCategoryIdValue = get(currentCategoryId);
		console.log(`🎯 Category ${normalizedId} is marked as initialized`);
		if (currentInfo && currentInfo.id && currentCategoryIdValue === normalizedId) {
			console.log(`✅ Category ${normalizedId} already fully initialized with ID: ${currentInfo.id}`);
			return currentInfo.id;
		} else {
			console.log(`⚠️ Category ${normalizedId} marked as initialized but store is inconsistent`);
		}
	}

	// NUEVO: Verificar si ya hay datos en el store (cargados por getCategoryInfo)
	const currentInfo = get(currentCategoryInfo);
	if (currentInfo && currentInfo.id) {
		console.log(`✅ Category ${normalizedId} already has data in store with ID: ${currentInfo.id}, skipping initialization`);
		initializedCategories.add(normalizedId);
		return currentInfo.id;
	}

	// Si ya hay una promesa de inicialización en curso, reutilizarla
	if (categoryInitializationPromises.has(normalizedId)) {
		console.log(`🔄 Category ${normalizedId} initialization already in progress, waiting...`);
		return await categoryInitializationPromises.get(normalizedId)!;
	}

	console.log(`🚀 Starting global initialization for category ${normalizedId} - CREATING DOCUMENT`);
	
	// Crear promesa de inicialización para esta categoría
	const initPromise = createInitialDocument(normalizedId);
	categoryInitializationPromises.set(normalizedId, initPromise);
	
	const result = await initPromise;
	
	// Marcar como inicializada y limpiar la promesa
	if (result) {
		initializedCategories.add(normalizedId);
		console.log(`✅ Category ${normalizedId} globally initialized with ID: ${result}`);
	} else {
		console.log(`❌ Failed to initialize category ${normalizedId}`);
	}
	categoryInitializationPromises.delete(normalizedId);
	
	return result;
}

// Log cuando se actualiza el store
currentCategoryInfo.subscribe((value) => {
	if (value) {
		// Verificar si hay contenido y actualizar el estado automáticamente
		const hasContent = hasCategoryContent(value);
		currentCategoryActive.set(hasContent);
	}
});
export const currentCategoryActive = writable<boolean>(false);

// Store para el estado de guardado de secciones específicas
export const isSectionSaving = writable<{
	section: string;
	saving: boolean;
}>({ section: '', saving: false });

// Store global para verificar si los campos obligatorios están completos
export const globalRequiredFieldsComplete = writable<boolean>(false);

// Store para mostrar mensaje cuando el usuario intenta usar campos deshabilitados
export const showRequiredFieldsMessage = writable<boolean>(false);

// Función para verificar si las secciones deberían estar deshabilitadas
export function shouldDisableSections(): boolean {
    return !get(globalRequiredFieldsComplete);
}

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

	// Para el primer guardado, permitir sin ID (el backend creará uno nuevo)
	if (!categoryInfo.id) {
		console.log('First save - no ID provided, backend will create new document');
	}

	console.log('Saving categoryInfo with id:', categoryInfo.id);

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
	console.log('debouncedSave - categoryInfo.id:', categoryInfo.id);
	console.log('debouncedSave - hasRealContent:', hasRealContent);
	autosaveStatus.set('saving');
	const success = await saveCategoryInfo(categoryInfo);
	if (success) {
		// El status ya se estableció en saveCategoryInfo
		autosaveStatus.set('saved');
	} else {
		// En caso de error, intentar una vez más después de 2 segundos
		setTimeout(async () => {
			const retrySuccess = await saveCategoryInfo(categoryInfo);
			if (!retrySuccess) {
				autosaveStatus.set('error');
			}
		}, 2000);
	}
}, 1500); // 1.5 segundos de debounce

// Función para actualizar el store global y trigger autosave
export function updateCategoryInfoAndSave(updates: Partial<CategoryInfoDTO>) {
	const currentInfo = get(currentCategoryInfo);
	const categoryId = get(currentCategoryId);
	
	if (!currentInfo) {
		console.warn('No current category info available - this might be the first time issue');
		return;
	}
	
	// Verificar si los datos realmente cambiaron
	const hasChanges = Object.keys(updates).some(key => {
		const currentValue = currentInfo[key as keyof CategoryInfoDTO];
		const newValue = updates[key as keyof CategoryInfoDTO];
		return JSON.stringify(currentValue) !== JSON.stringify(newValue);
	});
	
	// Si no hay cambios Y no hay ID, forzar el guardado para crear el documento inicial
	if (!hasChanges && !currentInfo.id) {
		console.log('No changes detected but no ID present, forcing save to create initial document');
	} else if (!hasChanges) {
		console.log('No changes detected, skipping update');
		return;
	}
	
	// Actualizar el store
	const updatedInfo = { ...currentInfo, ...updates };
	currentCategoryInfo.set(updatedInfo);
	
	// Asegurar que el documento completo se envíe al backend (con id)
	const documentToSave = {
		...updatedInfo,
		// Asegurar que siempre tengamos el id del documento existente
		id: currentInfo.id || updatedInfo.id
	};
	
	// Trigger autosave AL BACKEND (como Notion)
	debouncedSave(documentToSave);
	
	// Actualizar automáticamente el estado de la categoría después de guardar
	setTimeout(() => {
		autoUpdateCategoryState();
	}, 2000); // Esperar 2 segundos después del autosave para actualizar el estado
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

// Función para actualizar automáticamente el estado de la categoría
export async function autoUpdateCategoryState() {
    const currentInfo = get(currentCategoryInfo);
    const categoryId = get(currentCategoryId);

    if (!currentInfo || !categoryId) return;

    const { pillar, userId, token } = getRequiredParams();
    if (!userId || !pillar) return;

    const hasContent = hasCategoryContent(currentInfo);

    // Obtener el ID real de la categoría desde localStorage o usar el ID del documento
    let realCategoryId: string | null = null;

    // PRIORIZAR el ID de categoryData (categories collection) sobre currentInfo.id (cat_info collection)
    try {
        const pageData = JSON.parse(localStorage.getItem('pageData') || '{}');
        realCategoryId = pageData.categoryData?.id || null;
        console.log('🔍 Got categoryId from pageData:', realCategoryId);
    } catch (error) {
        console.error('Error getting category ID from localStorage:', error);
    }

    // Solo como fallback, usar el ID del documento actual (pero este puede ser incorrecto)
    if (!realCategoryId) {
        realCategoryId = currentInfo.id || null;
        console.log('🔍 Using currentInfo.id as fallback:', realCategoryId);
    }

    if (!realCategoryId) {
        console.error('No valid category ID found for state update');
        return;
    }

    // NUEVA LÓGICA: Solo auto-activar si la categoría estaba inactiva Y ahora tiene contenido
    // No auto-desactivar categorías que ya tienen contenido
    try {
        // Primero obtener el estado actual de la categoría desde el backend
        const currentCategoryResponse = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/get-categories?pillar=${pillar}&uid=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!currentCategoryResponse.ok) {
            console.error('Error fetching current category state');
            return;
        }

        const categoriesData = await currentCategoryResponse.json();
        console.log('🔍 Available categories from backend:', categoriesData.data);
        console.log('🔍 Looking for category with ID:', realCategoryId);
        
        const currentCategory = categoriesData.data?.find((cat: any) => cat.id === realCategoryId);
        
        if (!currentCategory) {
            console.error('Category not found in response');
            console.error('Available category IDs:', categoriesData.data?.map((cat: any) => cat.id));
            console.error('Looking for ID:', realCategoryId);
            return;
        }

        const currentlyActive = currentCategory.active;

        // REGLA: Solo actualizar si:
        // 1. La categoría está inactiva Y ahora tiene contenido (auto-activar)
        // 2. NO auto-desactivar categorías que ya están activas
        let shouldUpdateToActive = currentlyActive; // Por defecto, mantener el estado actual

        if (!currentlyActive && hasContent) {
            // Auto-activar categoría inactiva que ahora tiene contenido
            shouldUpdateToActive = true;
            console.log('Auto-activating empty category that now has content');
        } else if (currentlyActive) {
            // Mantener activa una categoría que ya estaba activa (respeta decisión manual)
            shouldUpdateToActive = true;
            console.log('Keeping category active (respecting manual decision)');
        } else {
            // Mantener inactiva una categoría que no tiene contenido
            shouldUpdateToActive = false;
            console.log('Keeping category inactive (no content)');
        }

        // Solo hacer la llamada al backend si hay un cambio real
        if (shouldUpdateToActive !== currentlyActive) {
            // Usar el endpoint update-category que SÍ existe
            const requestBody = {
                id: realCategoryId,
                label: currentCategory.label,
                name: currentCategory.name,
                active: shouldUpdateToActive,
                state: currentCategory.state,
                priority: currentCategory.priority,
                security: currentCategory.security
            };

            console.log('🔍 Request body for update-category:', requestBody);
            console.log('🔍 Current category data:', currentCategory);

            const response = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/update-category?pillar_type=${pillar}&uid=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            console.log('🔍 Response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.log('🔍 Response error text:', errorText);
            }

            if (response.ok) {
                console.log(`Categoría ${shouldUpdateToActive ? 'activada' : 'desactivada'} automáticamente`);
                currentCategoryActive.set(shouldUpdateToActive);

                // También actualizar el store de cards para que se refleje en la lista principal
                updateCategoryState(pillar, realCategoryId, shouldUpdateToActive);

                // Invalidar los datos de la página para que se recarguen las PillarCard
                setTimeout(() => {
                    invalidateAll();
                }, 500); // Pequeño delay para asegurar que el backend procese el cambio
            } else {
                console.error('Error updating category state:', response.status, response.statusText);
            }
        } else {
            console.log('No state change needed, current state is correct');
        }
    } catch (error) {
        console.error('Error updating category state:', error);
    }
}

// Función para actualizar el estado de la categoría basado en su contenido
export async function updateCategoryStateBasedOnContent(
    pillar: string, categoryId: string, userId: string, token: string
) {
    const categoryInfo = get(currentCategoryInfo);
    const hasContent = hasCategoryContent(categoryInfo);
    console.log(`Updating category state - Pillar: ${pillar}, CategoryId: ${categoryId}, HasContent: ${hasContent}`);
    
    // Obtener el ID real de la categoría desde localStorage
    let realCategoryId: string | null = null;
    
    // PRIORIZAR el ID de categoryData (categories collection) sobre currentInfo.id (cat_info collection)
    try {
        const pageData = JSON.parse(localStorage.getItem('pageData') || '{}');
        realCategoryId = pageData.categoryData?.id || null;
        console.log('🔍 Got categoryId from pageData (updateCategoryStateBasedOnContent):', realCategoryId);
    } catch (error) {
        console.error('Error getting category ID from localStorage:', error);
    }

    // Solo como fallback, usar el ID del documento actual (pero este puede ser incorrecto)
    if (!realCategoryId) {
        realCategoryId = categoryInfo?.id || null;
        console.log('🔍 Using currentInfo.id as fallback (updateCategoryStateBasedOnContent):', realCategoryId);
    }
    
    if (!realCategoryId) {
        console.error('No valid category ID found for state update');
        return;
    }
    
    try {
        // Primero obtener los datos actuales de la categoría
        const currentCategoryResponse = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/get-categories?pillar=${pillar}&uid=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!currentCategoryResponse.ok) {
            console.error('Error fetching current category data');
            return;
        }

        const categoriesData = await currentCategoryResponse.json();
        console.log('🔍 Available categories from backend (updateCategoryStateBasedOnContent):', categoriesData.data);
        console.log('🔍 Looking for category with ID (updateCategoryStateBasedOnContent):', realCategoryId);
        
        const currentCategory = categoriesData.data?.find((cat: any) => cat.id === realCategoryId);
        
        if (!currentCategory) {
            console.error('Category not found in response');
            console.error('Available category IDs:', categoriesData.data?.map((cat: any) => cat.id));
            console.error('Looking for ID:', realCategoryId);
            return;
        }

        // Usar el endpoint update-category que SÍ existe
        const requestBody = {
            id: realCategoryId,
            label: currentCategory.label,
            name: currentCategory.name,
            active: hasContent,
            state: currentCategory.state,
            priority: currentCategory.priority,
            security: currentCategory.security
        };

        const response = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/update-category?pillar_type=${pillar}&uid=${userId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            console.log(`Categoría ${hasContent ? 'activada' : 'desactivada'} automáticamente`);
            // Actualizar el store del estado activo
            currentCategoryActive.set(hasContent);
            
            // También actualizar el store de cards para que se refleje en la lista principal
            updateCategoryState(pillar, realCategoryId, hasContent);
            
            // Invalidar los datos de la página para que se recarguen las PillarCard
            setTimeout(() => {
                invalidateAll();
            }, 500); // Pequeño delay para asegurar que el backend procese el cambio
        } else {
            console.error('Error response:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error updating category state:', error);
    }
} 

// Función segura para actualizar el store sin sobrescribir datos existentes
export function safeUpdateCategoryInfo(newCategoryInfo: CategoryInfoDTO, categoryId: string) {
	const currentInfo = get(currentCategoryInfo);
	const currentCategoryIdValue = get(currentCategoryId);
	
	// Si es una categoría diferente, limpiar el store y establecer la nueva categoría
	if (currentCategoryIdValue !== categoryId) {
		console.log(`Category changed from ${currentCategoryIdValue} to ${categoryId}, clearing store`);
		currentCategoryInfo.set(newCategoryInfo);
		currentCategoryId.set(categoryId);
		return;
	}
	
	// Si no hay datos actuales, usar los nuevos datos (incluso si están vacíos)
	if (!currentInfo) {
		currentCategoryInfo.set(newCategoryInfo);
		currentCategoryId.set(categoryId);
		return;
	}
	
	// Combinar datos existentes con nuevos datos, preservando datos no vacíos
	const mergedInfo: CategoryInfoDTO = { ...currentInfo };
	
	// Actualizar todos los campos del newCategoryInfo, pero preservar datos existentes que no estén vacíos
	Object.keys(newCategoryInfo).forEach(key => {
		const fieldKey = key as keyof CategoryInfoDTO;
		const newValue = newCategoryInfo[fieldKey];
		const currentValue = currentInfo[fieldKey];
		
		// Si el campo actual está vacío o no existe, usar el nuevo valor
		if (!currentValue || (Array.isArray(currentValue) && currentValue.length === 0)) {
			(mergedInfo as any)[fieldKey] = newValue;
		} else {
			// Si el campo actual tiene datos, solo actualizar si el nuevo valor tiene datos reales
			if (Array.isArray(newValue) && newValue.length > 0) {
				const hasRealData = newValue.some(item => 
					item && item.description && item.description.trim() !== ''
				);
				if (hasRealData) {
					(mergedInfo as any)[fieldKey] = newValue;
				}
			}
		}
	});
	
	currentCategoryInfo.set(mergedInfo);
} 

// Función para cargar datos desde el store primero, luego desde el backend si es necesario
export async function loadFromStoreFirst<T>(
	sectionKey: keyof CategoryInfoDTO,
	convertFunction: (items: GenericItemDTO[]) => T[],
	categoryId: string
): Promise<T[]> {
	const normalizedId = normalizeCategoryId(categoryId);
	console.log(`📂 loadFromStoreFirst called for section: ${sectionKey}, categoryId: ${categoryId} (normalized: ${normalizedId})`);
	
	const currentInfo = get(currentCategoryInfo);
	const currentCategoryIdValue = get(currentCategoryId);
	
	console.log(`📂 currentCategoryIdValue: ${currentCategoryIdValue}`);
	console.log(`📂 currentInfo:`, currentInfo ? `has ID: ${currentInfo.id}` : 'null');
	
	// Solo cargar desde el store si es la misma categoría Y tiene un ID válido Y tiene datos
	if (currentCategoryIdValue === normalizedId && currentInfo && currentInfo.id && currentInfo[sectionKey] && Array.isArray(currentInfo[sectionKey])) {
		const items = currentInfo[sectionKey] as GenericItemDTO[];
		if (items.length > 0) {
			console.log(`✅ Loading ${sectionKey} from store:`, items.length, 'items');
			return convertFunction(items);
		}
	}
	
	console.log(`📂 No data in store for ${sectionKey}, section should load from backend`);
	return [];
} 

// Función para crear el documento inicial si no existe
async function createInitialDocument(categoryId: string): Promise<string | null> {
	console.log(`🏗️ createInitialDocument called for categoryId: ${categoryId}`);
	console.log(`🏗️ Stack trace:`, new Error().stack);
	
	// Verificar si ya hay un documento en el store
	const currentInfo = get(currentCategoryInfo);
	if (currentInfo && currentInfo.id) {
		console.log(`⚠️ createInitialDocument called but document already exists with ID: ${currentInfo.id}`);
		return currentInfo.id;
	}
	
	// Verificar si ya se está creando un documento
	if (creatingDocument) {
		console.log(`⏳ Document creation already in progress, waiting...`);
		// Esperar un poco y verificar si ya se creó
		await new Promise(resolve => setTimeout(resolve, 100));
		const updatedInfo = get(currentCategoryInfo);
		if (updatedInfo && updatedInfo.id) {
			console.log(`✅ Document was created while waiting: ${updatedInfo.id}`);
			return updatedInfo.id;
		}
	}
	
	creatingDocument = true;
	console.log(`🔒 Setting creatingDocument flag to true`);
	
	try {
		const { pillar, userId, token } = getRequiredParams();
		
		if (!userId || !pillar) {
			console.log('❌ Missing required data for initial document creation');
			return null;
		}

		console.log(`🏗️ Creating initial document for category: ${categoryId}, pillar: ${pillar}, userId: ${userId}`);

		const initialCategoryInfo = {
			cid: categoryId,
			uid: userId,
			is_current: true,
			elements: [],
			objectives: [],
			positive_actions: [],
			improve_actions: [],
			habits: [],
			short_actions: [],
			middle_actions: [],
			long_actions: [],
			created_at: new Date().toISOString(),
			updated_at: null
		};

		console.log(`🏗️ Sending initial document to backend:`, initialCategoryInfo);

		const response = await fetch(`${getEndpointByVenv().pillars}/api/v1/pillars/update-category-info?pillar=${pillar}`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization': `Bearer ${token}` 
			},
			body: JSON.stringify(initialCategoryInfo)
		});

		if (response.ok) {
			const responseData = await response.json();
			console.log(`✅ Initial document created successfully:`, responseData.data?.id);
			
			// Actualizar el store con el documento inicial
			if (responseData.data) {
				currentCategoryInfo.set(responseData.data);
				currentCategoryId.set(categoryId);
				console.log(`✅ Store updated with new document ID: ${responseData.data.id}`);
				return responseData.data.id;
			}
		} else {
			console.error(`❌ Failed to create initial document:`, response.status, response.statusText);
		}
	} catch (error) {
		console.error('❌ Error creating initial document:', error);
	} finally {
		creatingDocument = false;
		console.log(`🔓 Resetting creatingDocument flag to false`);
	}
	
	return null;
}