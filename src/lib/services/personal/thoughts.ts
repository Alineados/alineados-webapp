import type { Documents, ThoughtUpdate } from '$lib/interfaces';
import { getEndpointByVenv } from '../endpoints';
import { request, uploadFile, type Response } from '../http';

export class ThoughtService {
	private static instance: ThoughtService;
	private _host: string = getEndpointByVenv().thoughts;
	private _token: string;
	private _url: string = `${this._host}/api/v1/thoughts`;

	constructor(token: string) {
		this._token = token;
	}

	static getInstance(token: string): ThoughtService {
		if (!ThoughtService.instance) {
			ThoughtService.instance = new ThoughtService(token);
		}
		// update token
		ThoughtService.instance.updateToken(token);
		return ThoughtService.instance;
	}

	updateToken(token: string): void {
		this._token = token;
	}

	// GET
	async getThoughtsGrouped(uid: string): Promise<Response> {
		const url = `${this._url}/grouped?uid=${uid}`;
		const response: Response = await request(url, 'GET', null, this._token);

		return response;
	}

	async getThoughtInfo(tid: string): Promise<Response> {
		const url = `${this._url}/thought?tid=${tid}`;
		const response: Response = await request(url, 'GET', null, this._token);

		return response;
	}

	// POST
	async createDocumentUrl(doc: Documents): Promise<Response> {
		const url = `${this._url}/generate-document-url`;
		const response: Response = await request(url, 'POST', doc, this._token);

		return response;
	}

	async createThought(uid: string): Promise<Response> {
		const url = `${this._url}/create?uid=${uid}`;
		const response: Response = await request(url, 'POST', null, this._token);

		return response;
	}

	async uploadThoughtFile(
		uid: string,
		sid: string,
		category: string,
		file: File
	): Promise<Response> {
		const fileType = file.type;

		const form = new FormData();
		form.append('uid', uid);
		form.append('sid', sid);
		form.append('category', category);
		form.append('file', file);
		form.append('fileType', fileType);

		const url = `${this._url}/upload-file`;

		const response: Response = await uploadFile(url, 'POST', form, this._token);

		return response;
	}

	// PUT
	async updateThoughtInfo(tid: string, body: ThoughtUpdate): Promise<Response> {
		const url = `${this._url}/update-info?tid=${tid}`;
		const response: Response = await request(url, 'PUT', body, this._token);

		return response;
	}

	async updateIsImportant(sid: string, isImportant: boolean): Promise<Response> {
		const url = `${this._url}/update-important?sid=${sid}&isImportant=${isImportant}`;
		const response: Response = await request(url, 'PUT', null, this._token);

		return response;
	}
}
