import { writable, get } from 'svelte/store';
import type { Relation } from '$lib/interfaces/Relations.interface';

// PROFESSIONAL AUTOSAVE SYSTEM - Similar to Pillars
export const relationAutosaveStatus = writable<'idle' | 'saving' | 'saved' | 'error' | 'offline'>('idle');
export const relationLastSavedAt = writable<Date | null>(null);
export const isRelationSaving = writable(false);

// Estado de la relación actual (para detectar cambios)
export const currentRelationData = writable<Relation | null>(null);

// Network status (safe for SSR)
export const isOnline = writable(typeof navigator !== 'undefined' ? navigator.onLine : true);

// Listen to online/offline events
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        isOnline.set(true);
        // If we were offline and now online, retry failed saves
        const status = get(relationAutosaveStatus);
        if (status === 'offline') {
            relationAutosaveStatus.set('idle');
        }
    });
    
    window.addEventListener('offline', () => {
        isOnline.set(false);
        relationAutosaveStatus.set('offline');
    });
}

// Función para indicar que se está guardando
export function setRelationSaving(saving: boolean) {
    isRelationSaving.set(saving);
    
    if (saving) {
        relationAutosaveStatus.set('saving');
    }
}

// Función para indicar guardado exitoso
export function setRelationSaved() {
    isRelationSaving.set(false);
    relationAutosaveStatus.set('saved');
    relationLastSavedAt.set(new Date());
}

// Función para indicar error de guardado
export function setRelationError() {
    isRelationSaving.set(false);
    const online = get(isOnline);
    relationAutosaveStatus.set(online ? 'error' : 'offline');
}

// Función para actualizar los datos actuales
export function updateCurrentRelationData(data: Relation) {
    currentRelationData.set(data);
}

// Simple debounce implementation
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

export function debounce<T extends (...args: any[]) => any>(
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
