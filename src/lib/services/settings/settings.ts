
import { getEndpointByVenv } from "../endpoints";
import { request, uploadFile, type Response } from "../http";

export class SettingService {
	private static instance: SettingService;
	private _host: string = getEndpointByVenv().settings;
	private _token: string;
	private _url: string = `${this._host}/api/v1`;

	constructor(token: string) {
		this._token = token;
	}

	static getInstance(token: string): SettingService {
		if (!SettingService.instance) {
			SettingService.instance = new SettingService(token);
		}
		// update token
		SettingService.instance.updateToken(token);
		return SettingService.instance;
	}

	updateToken(token: string): void {
		this._token = token;
	}

	// GET
	async getSettings(uid: string): Promise<Response> {
		const url = `${this._url}/settings?uid=${uid}`;
		console.log({ url })
		const response: Response = await request(url, 'GET', null, this._token);

		return response;
	}
}
