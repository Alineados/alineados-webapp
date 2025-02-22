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

	public async getPurposes(uid: string): Promise<Response> {
		const url = `${this._url}/get-purposes?uid=${uid}`;

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

	async uploadThoughtFileOrAudio(
		uid: string,
		tid: string,
		pilar: string,
		file: File,
		isFile: boolean = true
	): Promise<Response> {
		const fileType = file.type;

		const form = new FormData();
		form.append('uid', uid);
		form.append('tid', tid);
		form.append('pilar', pilar);
		form.append('file', file);
		form.append('fileType', fileType);

		let url: string;
		if (isFile) url = `${this._url}/upload-file`;
		else url = `${this._url}/upload-audio`;

		const response: Response = await uploadFile(url, 'POST', form, this._token);

		return response;
	}

	async uploadThoughtFiles(
		uid: string,
		tid: string,
		files: File[],
		filesType: string[]
	): Promise<Response> {
		const form = new FormData();

		form.append('uid', uid);
		form.append('tid', tid);
		form.append('filesType', JSON.stringify(filesType));
		files.forEach((files, index) => {
			form.append(`file${index}`, files);
		});

		const url = `${this._url}/upload-files`;

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
