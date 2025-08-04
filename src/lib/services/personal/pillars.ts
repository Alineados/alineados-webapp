// /lib/services/personal/pillars.ts
import type { Documents } from '$lib/interfaces';
import { getEndpointByVenv } from '../endpoints';
import { request, uploadFile, type Response } from '../http';

// Interface para CategoryDTO
export interface CategoryDTO {
	id: string;
	label: string;
	name: string;
	active: boolean;
	state: number;
	priority: number;
	security: boolean;
}

// Interface para GenericItemDTO
export interface GenericItemDTO {
	id?: string;
	description: string;
	done: boolean;
	favorite: boolean;
	repeated: boolean;
	deleted: boolean;
}

// Interface para CategoryInfoDTO
export interface CategoryInfoDTO {
	id?: string;
	cid: string;
	uid: string;
	is_current: boolean;
	elements: GenericItemDTO[];
	objectives: GenericItemDTO[];
	positive_actions: GenericItemDTO[];
	improve_actions: GenericItemDTO[];
	habits: GenericItemDTO[];
	short_actions: GenericItemDTO[];
	middle_actions: GenericItemDTO[];
	long_actions: GenericItemDTO[];
	created_at?: string;
	updated_at?: string;
}

export class PillarService {
	private static instance: PillarService;
	private _host: string = getEndpointByVenv().pillars;
	private _token: string;
	private _url: string = `${this._host}/api/v1/pillars`;

	constructor(token: string) {
		this._token = token;
	}

	static getInstance(token: string): PillarService {
		if (!PillarService.instance) {
			PillarService.instance = new PillarService(token);
		}
		PillarService.instance.updateToken(token);
		return PillarService.instance;
	}

	updateToken(token: string): void {
		this._token = token;
	}

	// Método para obtener todos los pilares para un usuario
	async getAllPillars(uid: string): Promise<Response> {
		const url = `${this._url}/get-all?uid=${uid}`;
		const response: Response = await request(url, 'GET', null, this._token);
		return response;
	}

	// Método para actualizar una categoría completa
	async updateCategory(
		categoryData: CategoryDTO,
		pillarType: string,
		uid: string
	): Promise<Response> {
		const url = `${this._url}/update-category?pillar_type=${pillarType}&uid=${uid}`;
		const response: Response = await request(url, 'POST', categoryData, this._token);
		return response;
	}

	// Método para actualizar la información detallada de una categoría
	async updateCategoryInfo(
		categoryInfo: CategoryInfoDTO,
		pillarType: string
	): Promise<Response> {
		const url = `${this._url}/update-category-info?pillar=${pillarType}`;
		const response: Response = await request(url, 'POST', categoryInfo, this._token);
		return response;
	}

	// Método para obtener la información detallada de una categoría
	async getCategoryInfo(
		pillarType: string,
		cid: string,
		uid: string,
		isCurrent: boolean = true
	): Promise<Response> {
		const url = `${this._url}/get-category-info?pillar=${pillarType}&cid=${cid}&uid=${uid}&is_current=${isCurrent}`;
		const response: Response = await request(url, 'GET', null, this._token);
		return response;
	}
}
