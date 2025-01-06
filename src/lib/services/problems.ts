import { endpoints } from './endpoints';
import { request, type Response } from './http';

export class ProblemService {
	private static instance: ProblemService;
	private _host: string = endpoints.local.problems;
	private _token: string;
	private _url: string = `${this._host}/api/v1/problems`;

	constructor(token: string) {
		this._token = token;
	}

	static getInstance(token: string): ProblemService {
		if (!ProblemService.instance) {
			ProblemService.instance = new ProblemService(token);
		}
		// update token
		ProblemService.instance.updateToken(token);
		return ProblemService.instance;
	}

	updateToken(token: string): void {
		this._token = token;
	}

	// Methods
	async getGroupedProblems(
		uid: string,
		health_id: string,
		relational_id: string,
		vocational_id: string,
		spiritual_id: string
	): Promise<Response> {
		const url = `${this._url}/get-grouped?uid=${uid}&health_id=${health_id}&relational_id=${relational_id}&vocational_id=${vocational_id}&spiritual_id=${spiritual_id}`;
		const response: Response = await request(url, 'GET', null, this._token);

		return response;
	}

	async getProblemInfo(pid: string): Promise<Response> {
		const url = `${this._url}/get-info?pid=${pid}`;
		const response: Response = await request(url, 'GET', null, this._token);

		return response;
	}

	async createProblemInfo(body: any): Promise<Response> {
		const url = `${this._url}/create`;
		const response: Response = await request(url, 'POST', body, this._token);

		return response;
	}

	async deleteProblemInfo(pid: string): Promise<Response> {
		const url = `${this._url}/delete?pid=${pid}`;
		const response: Response = await request(url, 'DELETE', null, this._token);

		return response;
	}

	async getAllProblems(
		uid: string,
		health_id: string,
		relational_id: string,
		vocational_id: string,
		spiritual_id: string
	): Promise<Response> {
		const url = `${this._url}/get-all?uid=${uid}&health_id=${health_id}&relational_id=${relational_id}&vocational_id=${vocational_id}&spiritual_id=${spiritual_id}`;
		const response: Response = await request(url, 'GET', null, this._token);

		return response;
	}

	async uploadImage(uid: string, pcid: string, file: File) {
		const form = new FormData();
		form.append('uid', uid);
		form.append('pcid', pcid);
		form.append('file', file);

		const options = {
			method: 'POST',
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${this._token}`
			},
			body: form
		};

		const response = await fetch(`${this._url}/upload-image`, options);

		const data = await response.json();

		return data;
	}
}
