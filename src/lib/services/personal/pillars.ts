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
}
