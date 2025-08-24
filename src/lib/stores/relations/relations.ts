import type { 
    Relation, 
    RelationListItem, 
    Area 
} from '$lib/interfaces/Relations.interface';
import { derived, writable } from 'svelte/store';

// Stores principales - SIN datos mock, completamente limpios
export const relations = writable<RelationListItem[]>([]);
export const areas = writable<Area[]>([]);
export const selectedRelation = writable<Relation | null>(null);

// Stores para filtros y búsqueda
export const searchTerm = writable<string>('');
export const selectedAreaId = writable<string>('');
export const filterISeekThem = writable<boolean | null>(null);
export const filterTheySeekMe = writable<boolean | null>(null);
export const filterStatus = writable<string>('');
export const includeArchived = writable<boolean>(false);
export const sortBy = writable<string>('updated_desc');

// Store para loading states
export const isLoading = writable<boolean>(false);
export const isLoadingRelation = writable<boolean>(false);
export const totalRelations = writable<number>(0);

// Derived store para filtrar relaciones localmente
export const relationsFiltered = derived(
    [relations, searchTerm, selectedAreaId, filterISeekThem, filterTheySeekMe, filterStatus, includeArchived],
    ([$relations, $searchTerm, $selectedAreaId, $filterISeekThem, $filterTheySeekMe, $filterStatus, $includeArchived]) => {
        return $relations.filter(relation => {
            // Filtro por búsqueda de texto
            if ($searchTerm && !relation.full_name.toLowerCase().includes($searchTerm.toLowerCase())) {
                return false;
            }
            
            // Filtro por área
            if ($selectedAreaId && relation.area_id !== $selectedAreaId) {
                return false;
            }
            
            // Filtro por "yo los busco"
            if ($filterISeekThem !== null && relation.i_seek_them !== $filterISeekThem) {
                return false;
            }
            
            // Filtro por "ellos me buscan"
            if ($filterTheySeekMe !== null && relation.they_seek_me !== $filterTheySeekMe) {
                return false;
            }
            
            // Filtro por estado
            if ($filterStatus && relation.status !== $filterStatus) {
                return false;
            }
            
            // Filtro por archivados
            if ($includeArchived) {
                // Si includeArchived está activo, solo mostrar archivadas
                if (!relation.archived) {
                    return false;
                }
            } else {
                // Si includeArchived está desactivado, NO mostrar archivadas
                if (relation.archived) {
                    return false;
                }
            }
            
            return true;
        });
    }
);

// Función para limpiar todos los stores (útil para logout)
export const clearAllData = () => {
    relations.set([]);
    areas.set([]);
    selectedRelation.set(null);
    totalRelations.set(0);
    clearFilters();
};

// Función para limpiar filtros
export const clearFilters = () => {
    searchTerm.set('');
    selectedAreaId.set('');
    filterISeekThem.set(null);
    filterTheySeekMe.set(null);
    filterStatus.set('');
    includeArchived.set(false);
    sortBy.set('updated_desc');
};

// Función para crear relación vacía (sin datos hardcodeados)
export const createEmptyRelation = (uid: string): Relation => ({
    id: '',
    uid,
    full_name: '',
    area_id: '',
    i_seek_them: false,
    they_seek_me: false,
    status: '',
    highlighted: false,
    profession: [],
    vocation: [],
    positive_qualities: [],
    improvement_qualities: [],
    goals_with_person: [],
    important_dates: [],
    contact_info: {
        phone_numbers: [],
        emails: [],
        social_networks: []
    },
    photo_url: '',
    archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
});

// Helper para obtener el color del estado
export const getStateColor = (status: string | number): { bg: string; text: string; icon: string } => {
    // If number, convert to appropriate level (1=feliz, 2=normal, 3=triste)
    if (typeof status === 'number') {
        switch (status) {
            case 1: // Feliz
                return { 
                    bg: 'bg-alineados-green-100', 
                    text: 'text-alineados-green-500',
                    icon: 'text-alineados-green-500'
                };
            case 2: // Normal
                return { 
                    bg: 'bg-yellow-100', 
                    text: 'text-yellow-500',
                    icon: 'text-yellow-500'
                };
            case 3: // Triste
                return { 
                    bg: 'bg-red-100', 
                    text: 'text-red-500',
                    icon: 'text-red-500'
                };
            default:
                return { 
                    bg: 'bg-gray-100', 
                    text: 'text-gray-500',
                    icon: 'text-gray-500'
                };
        }
    }
    
    // Handle legacy string values
    switch (status.toLowerCase()) {
        case 'bien':
            return { 
                bg: 'bg-alineados-green-100', 
                text: 'text-alineados-green-500',
                icon: 'text-alineados-green-500'
            };
        case 'normal':
            return { 
                bg: 'bg-yellow-100', 
                text: 'text-yellow-500',
                icon: 'text-yellow-500'
            };
        case 'mal':
            return { 
                bg: 'bg-red-100', 
                text: 'text-red-500',
                icon: 'text-red-500'
            };
        default:
            return { 
                bg: 'bg-gray-100', 
                text: 'text-gray-500',
                icon: 'text-gray-500'
            };
    }
};

// Helper para obtener el número de estado para los iconos
export const getStateLevel = (status: string | number): number => {
    // If already a number, return it directly
    if (typeof status === 'number') {
        return status >= 1 && status <= 3 ? status : 0;
    }
    
    // Handle string values (legacy)
    switch (status.toLowerCase()) {
        case 'bien':
        case 'buena':
            return 1; // HappyFace
        case 'normal':
        case 'regular':
            return 2; // MedFace
        case 'mal':
        case 'mala':
            return 3; // SadFace
        default:
            return 0; // Sin ícono
    }
};