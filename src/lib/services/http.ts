interface Options {
	method: string;
	credentials?: RequestCredentials;
	headers: { [key: string]: string };
	body?: string;
}

export interface Response {
	data: any;
	message: string;
	status?: number;
}

export async function request(
	url: string,
	method: string,
	body: any | undefined,
	apiKey: string
): Promise<Response> {
	const options: Options = {
		method: method,
		// credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			Authorization: `Bearer ${apiKey}`
		}
	};

	if (body) options.body = JSON.stringify(body);
	const response = await fetch(url, options);

	if (response.status === 401) {
		return {
			data: null,
			message: 'Unauthorized',
			status: response.status
		};
	}

	if (response.status === 404) {
		return {
			data: null,
			message: 'Not found',
			status: response.status
		};
	}

	if (response.status === 400) {
		return {
			data: null,
			message: 'Bad request',
			status: response.status
		};
	}

	if (response.status === 500) {
		return {
			data: null,
			message: 'Internal server error',
			status: response.status
		};
	}

	const data: Response = await response.json();

	return {
		data: data.data,
		message: data.message,
		status: response.status
	};
}
