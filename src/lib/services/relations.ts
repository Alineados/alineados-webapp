import type { 
    RelationsListRequest, 
    RelationsListResponse, 
    Area, 
    Relation,
    UpsertRelationRequest 
} from '$lib/interfaces/Relations.interface';
import { getEndpointByVenv } from './endpoints';

// Headers comunes para las requests
const getHeaders = () => ({
    'Content-Type': 'application/json',
});

export class RelationsService {
    private static get baseURL() {
        return `${getEndpointByVenv().pillars}/api/v1/relations`;
    }

    // Obtener lista optimizada de relaciones
    static async getRelationsList(request: RelationsListRequest): Promise<RelationsListResponse> {
        const params = new URLSearchParams();
        
        // Agregar parámetros requeridos
        params.append('uid', request.uid);
        
        // Agregar parámetros opcionales
        if (request.page !== undefined) params.append('page', request.page.toString());
        if (request.limit !== undefined) params.append('limit', request.limit.toString());
        if (request.search) params.append('search', request.search);
        if (request.area_id) params.append('area_id', request.area_id);
        if (request.i_seek_them !== undefined) params.append('i_seek_them', request.i_seek_them.toString());
        if (request.they_seek_me !== undefined) params.append('they_seek_me', request.they_seek_me.toString());
        if (request.status) params.append('status', request.status);
        if (request.sort) params.append('sort', request.sort);
        if (request.include_archived !== undefined) params.append('include_archived', request.include_archived.toString());

        const response = await fetch(`${this.baseURL}/list?${params.toString()}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch relations: ${response.statusText}`);
        }

        return await response.json();
    }

    // Obtener información completa de una relación
    static async getRelationById(uid: string, relationId: string): Promise<Relation> {
        const params = new URLSearchParams({ uid });
        
        const response = await fetch(`${this.baseURL}/info?${params.toString()}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch relation: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Buscar la relación específica en la respuesta
        const relation = data.relations?.find((r: Relation) => r.id === relationId);
        
        if (!relation) {
            throw new Error('Relation not found');
        }

        return relation;
    }

    // Crear/actualizar relación (autosave)
    static async upsertRelation(request: UpsertRelationRequest): Promise<Relation> {
        const response = await fetch(`${this.baseURL}/info`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`Failed to upsert relation: ${response.statusText}`);
        }

        return await response.json();
    }

    // Crear nueva relación
    static async createRelation(request: UpsertRelationRequest): Promise<Relation> {
        const response = await fetch(`${this.baseURL}/info`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`Failed to create relation: ${response.statusText}`);
        }

        return await response.json();
    }

    // Eliminar relación (archivado o eliminación permanente)
    static async deleteRelation(uid: string, relationId: string): Promise<void> {
        const params = new URLSearchParams({ 
            uid, 
            id: relationId 
        });
        
        const response = await fetch(`${this.baseURL}/relation-delete?${params.toString()}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to delete relation: ${response.statusText}`);
        }
    }

    // Obtener todas las áreas del usuario
    static async getAreas(uid: string): Promise<Area[]> {
        const params = new URLSearchParams({ uid });
        
        const response = await fetch(`${this.baseURL}/areas?${params.toString()}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch areas: ${response.statusText}`);
        }

        const data = await response.json();
        return data.areas || [];
    }

    // Crear nueva área
    static async createArea(uid: string, name: string): Promise<Area> {
        const response = await fetch(`${this.baseURL}/areas`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ uid, name }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create area: ${response.statusText}`);
        }

        return await response.json();
    }

    // Actualizar área
    static async updateArea(uid: string, areaId: string, name: string): Promise<Area> {
        const response = await fetch(`${this.baseURL}/areas/update`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ uid, id: areaId, name }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update area: ${response.statusText}`);
        }

        return await response.json();
    }

    // Eliminar área
    static async deleteArea(uid: string, areaId: string): Promise<void> {
        const params = new URLSearchParams({ 
            uid, 
            id: areaId 
        });
        
        const response = await fetch(`${this.baseURL}/area-delete?${params.toString()}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to delete area: ${response.statusText}`);
        }
    }
}
