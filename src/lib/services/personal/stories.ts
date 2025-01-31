import type { Documents, StoryUpdate } from "$lib/interfaces";
import { getEndpointByVenv } from "../endpoints";
import { request, uploadFile, type Response } from "../http";

export class StoryService {
    private static instance: StoryService;
    private _host: string = getEndpointByVenv().stories;
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



    // GET
    async getStoriesGrouped(uid: string): Promise<Response> {
        const url = `${this._url}/grouped?uid=${uid}`;
        const response: Response = await request(url, 'GET', null, this._token);

        return response;
    }

    async getStoryInfo(sid: string): Promise<Response> {
        const url = `${this._url}/story?sid=${sid}`;
        const response: Response = await request(url, 'GET', null, this._token);

        return response;
    }

    // POST
    async createDocumentUrl(doc: Documents): Promise<Response> {
        const url = `${this._url}/generate-document-url`;
        const response: Response = await request(url, 'POST', doc, this._token);

        return response;
    }

    async createStory(uid: string): Promise<Response> {
        const url = `${this._url}/create?uid=${uid}`;
        const response: Response = await request(url, 'POST', null, this._token);

        return response;
    }

    async uploadStoryFile(uid: string, sid: string, category: string, file: File): Promise<Response> {
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
    async updateStoryInfo(sid: string, body: StoryUpdate): Promise<Response> {
        const url = `${this._url}/update-info?sid=${sid}`;
        const response: Response = await request(url, 'PUT', body, this._token);

        return response;
    }

    async updateIsImportant(sid: string, isImportant: boolean): Promise<Response> {
        const url = `${this._url}/update-important?sid=${sid}&isImportant=${isImportant}`;
        const response: Response = await request(url, 'PUT', null, this._token);

        return response;
    }
}