import {getEndpointByVenv } from './endpoints';
import { request, type Response } from './http';

export class OnboardingService {
	private static instance: OnboardingService;
	private _host: string = getEndpointByVenv().auth;
	private _token: string;
	private _url: string = `${this._host}/api/v1/auth`;

	constructor(token: string) {
		this._token = token;
	}

	public static getInstance(token: string): OnboardingService {
		if (!OnboardingService.instance) {
			OnboardingService.instance = new OnboardingService(token);
		}
		// update token
		OnboardingService.instance.updateToken(token);
		return OnboardingService.instance;
	}

	public updateToken(token: string): void {
		this._token = token;
	}

	// Methods
	public async verifyUserExists(body: any): Promise<Response> {
		const url = `${this._url}/verify-user-exists`;
		const response: Response = await request(url, 'POST', body, this._token);

		return response;
	}

	public async sendVerificationEmail(body: any): Promise<Response> {
		const url = `${this._url}/send-verification-email`;
		const response: Response = await request(url, 'POST', body, this._token);

		return response;
	}

	public async verifyEmail(body: any): Promise<Response> {
		const url = `${this._url}/verify-email`;
		const response: Response = await request(url, 'POST', body, this._token);

		return response;
	}

	public async createUser(body: any): Promise<Response> {
		const url = `${this._url}/create-user`;
		const response: Response = await request(url, 'POST', body, this._token);

		return response;
	}
}
