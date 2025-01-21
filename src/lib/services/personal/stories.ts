import { endpoints } from "../endpoints";
import { request, type Response } from "../http";

export class StoryService {
    private static instance: StoryService;
    private _host: string = endpoints.local.problems;
    private _token: string;
    private _url: string = `${this._host}/api/v1/stories`;

    constructor(token: string) {
		this._token = token;
	}

    static getInstance(token: string): StoryService {
		if (!StoryService.instance) {
			StoryService.instance = new StoryService(token);
		}
		// update token
		StoryService.instance.updateToken(token);
		return StoryService.instance;
	}

    updateToken(token: string): void {
		this._token = token;
	}

    // METHODS

    // POST
    async createStory(uid: string): Promise<Response> {
        const url = `${this._url}/create?uid=${uid}`;
        const response: Response = await request(url, 'POST', null, this._token);

        return response;
    }
}