import type { Relation, Area } from '$lib/interfaces/Relations.interface';
import { getEndpointByVenv } from '../endpoints';

export interface RelationContactInfo {
    phone_numbers: string[];
    emails: string[];
    social_networks: Array<{
        platform: string;
        handle: string;
    }>;
}

export interface RelationImportantDate {
    date: string;
    label: string;
}

export interface RelationUpdateRequest {
    id?: string;
    uid: string;
    full_name?: string;
    area_id?: string;
    i_seek_them?: boolean;
    they_seek_me?: boolean;
    status?: string;
    profession?: string[];
    vocation?: string[];
    positive_qualities?: string[];
    improvement_qualities?: string[];
    goals_with_person?: string[];
    important_dates?: RelationImportantDate[];
    contact_info?: RelationContactInfo;
    photo_url?: string;
}

export interface RelationCreateResponse {
    message: string;
    data: Relation;
}

export interface RelationUpdateResponse {
    message: string;
    data: Relation;
}

export interface AreasResponse {
    message: string;
    data: Area[];
}

export class RelationService {
    private static instance: RelationService;
    private token: string;
    private host: string;
    private baseUrl: string;

    private constructor(token: string) {
        this.token = token;
        this.host = getEndpointByVenv().pillars; // Same backend as pillars
        this.baseUrl = `${this.host}/api/v1/relations`;
    }

    private normalizeRelation(raw: any): Relation {
        if (!raw) return raw as Relation;
        const id = raw.id || raw._id || '';
        const contact = raw.contact_info || {};
        const normalized: Relation = {
            id,
            uid: raw.uid || '',
            full_name: raw.full_name ?? '',
            area_id: raw.area_id ?? '',
            i_seek_them: Boolean(raw.i_seek_them),
            they_seek_me: Boolean(raw.they_seek_me),
            status: raw.status ?? '',
            profession: Array.isArray(raw.profession) ? raw.profession : [],
            vocation: Array.isArray(raw.vocation) ? raw.vocation : [],
            positive_qualities: Array.isArray(raw.positive_qualities) ? raw.positive_qualities : [],
            improvement_qualities: Array.isArray(raw.improvement_qualities) ? raw.improvement_qualities : [],
            goals_with_person: Array.isArray(raw.goals_with_person) ? raw.goals_with_person : [],
            important_dates: Array.isArray(raw.important_dates) ? raw.important_dates : [],
            contact_info: {
                phone_numbers: Array.isArray(contact.phone_numbers) ? contact.phone_numbers : [],
                emails: Array.isArray(contact.emails) ? contact.emails : [],
                social_networks: Array.isArray(contact.social_networks) ? contact.social_networks : [],
            },
            photo_url: raw.photo_url ?? '',
            archived: Boolean(raw.archived),
            created_at: raw.created_at ?? new Date().toISOString(),
            updated_at: raw.updated_at ?? new Date().toISOString(),
        } as Relation;
        return normalized;
    }

    public static getInstance(token: string): RelationService {
        if (!RelationService.instance) {
            RelationService.instance = new RelationService(token);
        }
        return RelationService.instance;
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<{ status: number; data?: T; error?: string }> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            console.log('🔍 RelationService - Making request to:', url);
            console.log('🔍 RelationService - Request options:', options);



            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                    ...options.headers,
                },
            });

            const data = await response.json();
            console.log('🔍 RelationService - Response status:', response.status);
            console.log('🔍 RelationService - Response data:', data);

            return {
                status: response.status,
                data: response.ok ? data : undefined,
                error: response.ok ? undefined : data.message || 'Unknown error',
            };
        } catch (error) {
            console.error('❌ RelationService - Request failed:', error);
            return {
                status: 500,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    // Create or update relation (autosave)
    async saveRelation(relationData: RelationUpdateRequest): Promise<{ status: number; data?: Relation; error?: string }> {
        console.log('🔍 RelationService - Saving relation:', relationData);
        
        const result = await this.makeRequest<{ message: string; data: Relation }>('/info', {
            method: 'PUT',
            body: JSON.stringify(relationData),
        });

        console.log('🔍 RelationService - Raw backend response:', result);

        const normalized = result.data?.data ? this.normalizeRelation(result.data.data) : undefined;

        return {
            status: result.status,
            data: normalized,
            error: result.error,
        };
    }

    // Get all areas for user
    async getAreas(uid: string): Promise<{ status: number; data?: Area[]; error?: string }> {
        const result = await this.makeRequest<AreasResponse>(`/areas?uid=${uid}`);
        
        return {
            status: result.status,
            data: result.data?.data,
            error: result.error,
        };
    }

    // Get relation by ID
    async getRelation(id: string, uid: string): Promise<{ status: number; data?: Relation; error?: string }> {
        const result = await this.makeRequest<{ message: string; data: Relation }>(`/info/${id}?uid=${uid}`);
        const normalized = result.data?.data ? this.normalizeRelation(result.data.data) : undefined;
        return {
            status: result.status,
            data: normalized,
            error: result.error,
        };
    }

    // Delete relation
    async deleteRelation(id: string, uid: string): Promise<{ status: number; error?: string }> {
        const result = await this.makeRequest(`/relation-delete?id=${id}&uid=${uid}`, {
            method: 'DELETE',
        });

        return {
            status: result.status,
            error: result.error,
        };
    }

    // Create empty relation for new relation flow
    async createEmptyRelation(uid: string): Promise<{ status: number; data?: Relation; error?: string }> {
        console.log('🔍 RelationService - Creating empty relation for UID:', uid);
        
        return this.saveRelation({ uid });
    }

    // Check if relation has meaningful content
    isRelationEmpty(relation: Relation): boolean {
        const hasName = relation.full_name && relation.full_name.trim() !== '';
        const hasArea = relation.area_id && relation.area_id.trim() !== '';
        const hasStatus = relation.status && relation.status.trim() !== '';
        const hasIndicators = relation.i_seek_them || relation.they_seek_me;
        
        const hasProfession = relation.profession && relation.profession.length > 0 && 
            relation.profession.some(p => p.trim() !== '');
        const hasVocation = relation.vocation && relation.vocation.length > 0 && 
            relation.vocation.some(v => v.trim() !== '');
        const hasQualities = (relation.positive_qualities && relation.positive_qualities.length > 0 && 
            relation.positive_qualities.some(q => q.trim() !== '')) ||
            (relation.improvement_qualities && relation.improvement_qualities.length > 0 && 
            relation.improvement_qualities.some(q => q.trim() !== ''));
        const hasGoals = relation.goals_with_person && relation.goals_with_person.length > 0 && 
            relation.goals_with_person.some(g => g.trim() !== '');
        const hasDates = relation.important_dates && relation.important_dates.length > 0;
        
        const hasContactInfo = relation.contact_info && (
            (relation.contact_info.phone_numbers && relation.contact_info.phone_numbers.length > 0) ||
            (relation.contact_info.emails && relation.contact_info.emails.length > 0) ||
            (relation.contact_info.social_networks && relation.contact_info.social_networks.length > 0)
        );
        
        const hasPhoto = relation.photo_url && relation.photo_url.trim() !== '';
        
        return !(hasName || hasArea || hasStatus || hasIndicators || hasProfession || 
                hasVocation || hasQualities || hasGoals || hasDates || hasContactInfo || hasPhoto);
    }

    // Get list of relations (optimized for home page)
    async getRelationsList(uid: string, limit: number = 100): Promise<{ status: number; data?: any; error?: string }> {
        const result = await this.makeRequest<{ message: string; data: { relations: any[]; total: number; page: number; limit: number; has_more: boolean; total_pages: number } }>(`/list?uid=${uid}&limit=${limit}`);
        
        console.log('🔍 RelationService - Relations list response:', result);
        const payload = result.data?.data;
        if (payload && Array.isArray(payload.relations)) {
            payload.relations = payload.relations.map((r: any) => ({
                ...r,
                id: r.id || r._id,
            }));
        }
        
        return {
            status: result.status,
            data: payload, // { relations, total, ... }
            error: result.error,
        };
    }

    // Public makeRequest method for special cases
    async makeRequestPublic<T>(endpoint: string, options: RequestInit = {}): Promise<{ status: number; data?: T; error?: string }> {
        return this.makeRequest<T>(endpoint, options);
    }

    // Clean up empty relation if it exists
    async cleanupEmptyRelation(relation: Relation): Promise<void> {
        if (!relation.id || !this.isRelationEmpty(relation)) {
            return; // Nothing to clean up
        }

        console.log('🧹 RelationService - Cleaning up empty relation:', relation.id);
        
        try {
            await this.deleteRelation(relation.id, relation.uid);
            console.log('✅ RelationService - Empty relation cleaned up successfully');
        } catch (error) {
            console.error('❌ RelationService - Error cleaning up empty relation:', error);
        }
    }
}
