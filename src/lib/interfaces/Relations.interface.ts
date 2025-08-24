// Interfaces basadas en los DTOs del backend

export interface SocialNetwork {
    platform: string; // Instagram, Twitter, LinkedIn, etc.
    handle: string;   // @username o URL
}

export interface ImportantDate {
    date: string; // ISO string format
    label: string; // Cumpleaños, Aniversario, etc.
}

export interface ContactInfo {
    phone_numbers: string[];
    emails: string[];
    social_networks: SocialNetwork[];
}

export interface Area {
    id: string;
    uid: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Relation {
    id: string;
    uid: string;
    full_name: string;
    area_id: string;
    photo_url?: string;
    i_seek_them: boolean;
    they_seek_me: boolean;
    status: string; // Estados: "bien", "normal", "mal"
    highlighted: boolean; // Relación destacada
    profession: string[];
    vocation: string[];
    positive_qualities: string[];
    improvement_qualities: string[];
    goals_with_person: string[];
    important_dates: ImportantDate[];
    contact_info: ContactInfo;
    archived: boolean;
    created_at: string;
    updated_at: string;
}

// Para la vista optimizada de lista
export interface RelationListItem {
    id: string;
    full_name: string;
    area_id: string;
    area_name: string;
    photo_url?: string;
    i_seek_them: boolean;
    they_seek_me: boolean;
    status: string;
    highlighted: boolean; // Relación destacada
    gatherings_count: number; // Contador anual
    updated_at: string;
}

export interface RelationsListResponse {
    relations: RelationListItem[];
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
    total_pages: number;
}

// Para requests al backend
export interface RelationsListRequest {
    uid: string;
    page?: number;
    limit?: number;
    search?: string;
    area_id?: string;
    i_seek_them?: boolean;
    they_seek_me?: boolean;
    status?: string;
    sort?: string;
    include_archived?: boolean;
}

export interface UpsertRelationRequest {
    id?: string;
    uid: string;
    full_name?: string;
    area_id?: string;
    photo_url?: string;
    i_seek_them?: boolean;
    they_seek_me?: boolean;
    status?: string;
    highlighted?: boolean;
    profession?: string[];
    vocation?: string[];
    positive_qualities?: string[];
    improvement_qualities?: string[];
    goals_with_person?: string[];
    important_dates?: ImportantDate[];
    contact_info?: ContactInfo;
}

// Estados posibles para las relaciones
export const RELATION_STATES = {
    BIEN: 'bien',
    NORMAL: 'normal', 
    MAL: 'mal'
} as const;

// Tipos de ordenamiento
export const SORT_OPTIONS = {
    NAME_ASC: 'name_asc',
    NAME_DESC: 'name_desc',
    CREATED_ASC: 'created_asc',
    CREATED_DESC: 'created_desc',
    UPDATED_DESC: 'updated_desc'
} as const;
