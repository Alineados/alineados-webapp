import { endpoints } from './endpoints';
import { request, type Response } from './http';

export class AuthService {
	private static instance: AuthService;
	private _host: string = endpoints.local.auth;
	private _token: string;
	private _url: string = `${this._host}/api/v1/auth`;

	constructor(token: string) {
		this._token = token;
	}

	public static getInstance(token: string): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService(token);
		}
		// update token
		AuthService.instance.updateToken(token);
		return AuthService.instance;
	}

	public updateToken(token: string): void {
		this._token = token;
	}

	// Methods
	public async loginUsers(body: any): Promise<Response> {
		const url = `${this._url}/login`;
		const response: Response = await request(url, 'POST', body, this._token);

		return response;
	}
}
