import type { RelationListItem } from '$lib/interfaces/Relations.interface';
import { getEndpointByVenv } from '../endpoints';

export interface CreateGatheringRequest {
    uid: string;
    relation_id: string;
    date: string; // ISO
    notes?: string;
    photo_url?: string;
    location?: string;
}

export class GatheringsService {
    private static instance: GatheringsService;
    private token: string;
    private host: string;
    private baseUrl: string;

    private constructor(token: string) {
        this.token = token;
        this.host = getEndpointByVenv().pillars;
        this.baseUrl = `${this.host}/api/v1/gatherings`;
    }

    public static getInstance(token: string): GatheringsService {
        if (!GatheringsService.instance) {
            GatheringsService.instance = new GatheringsService(token);
        }
        return GatheringsService.instance;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ status: number; data?: T; error?: string }> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
                    ...options.headers,
                },
            });
            const data = await response.json().catch(() => undefined);
            return { status: response.status, data: response.ok ? data : undefined, error: response.ok ? undefined : (data?.message || 'Unknown error') };
        } catch (e) {
            return { status: 500, error: e instanceof Error ? e.message : 'Network error' };
        }
    }

    async create(payload: CreateGatheringRequest): Promise<{ status: number; data?: any; error?: string }> {
        return this.request<any>('/', { method: 'POST', body: JSON.stringify(payload) });
    }
}


