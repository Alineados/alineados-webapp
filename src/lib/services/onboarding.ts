import { endpoints } from './endpoints';
import { request, type Response } from './http';

export class OnboardingService {
	private static instance: OnboardingService;
	private _host: string = endpoints.local.auth;
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
	public async registerUser(body: any): Promise<Response> {
		const url = `${this._url}/create-user`;
		const response: Response = await request(url, 'POST', body, this._token);

		return response;
	}

	public async verifyEmailCode(body: any): Promise<Response> {
		const url = `${this._url}/verify-email`;
		const response: Response = await request(url, 'POST', body, this._token);

		return response;
	}

	public async confirmPassword(body: any): Promise<Response> {
		const url = `${this._url}/confirm-password`;
		const response: Response = await request(url, 'PATCH', body, this._token);

		return response;
	}
}
