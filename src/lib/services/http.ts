interface Options {
	method: string;
	credentials?: RequestCredentials;
	headers: { [key: string]: string };
	body?: string | FormData;
}

export interface Response {
	data: any;
	message: string;
	status?: number;
}

export async function uploadFile(
	url: string,
	method: string,
	form: FormData,
	apiKey: string
): Promise<Response> {
	try {
		const options: Options = {
			method: method,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Authorization': `Bearer ${apiKey}`
			},
			body: form
		};

		const response = await fetch(url, options);
		return evaluateResponse(response);
	} catch (error) {
		console.error('Error en uploadFile:', error);
		return {
			data: null,
			message: 'Error de red al intentar realizar la petición',
			status: 0
		};
	}
}

export async function request(
	url: string,
	method: string,
	body: any | undefined,
	apiKey: string
): Promise<Response> {
	const maxRetries = 3;
	let retryCount = 0;

	while (retryCount < maxRetries) {
		try {
			const options: Options = {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Authorization': `Bearer ${apiKey}`
				}
			};

			if (body) options.body = JSON.stringify(body);
			
			console.log(`Intento ${retryCount + 1} de ${maxRetries} - Realizando petición a:`, url);
			console.log('Con token:', apiKey.substring(0, 10) + '...');
			
			const response = await fetch(url, options);
			
			// Procesar la respuesta incluso si no es OK
			return evaluateResponse(response);
		} catch (error) {
			retryCount++;
			console.error(`Error en request (intento ${retryCount}):`, error);
			
			if (retryCount === maxRetries) {
				return {
					data: null,
					message: 'Error de conexión al servidor. Por favor, verifique su conexión a internet e intente nuevamente.',
					status: 0
				};
			}
			
			// Esperar antes de reintentar (exponencial backoff)
			await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
		}
	}

	return {
		data: null,
		message: 'Error de conexión al servidor. Por favor, verifique su conexión a internet e intente nuevamente.',
		status: 0
	};
}

async function evaluateResponse(response: globalThis.Response): Promise<Response> {
	try {
		if (response.status === 401) {
			return {
				data: null,
				message: 'No autorizado',
				status: response.status
			};
		}

		if (response.status === 404) {
			return {
				data: null,
				message: 'No encontrado',
				status: response.status
			};
		}

		if (response.status === 400) {
			return {
				data: null,
				message: 'Solicitud incorrecta',
				status: response.status
			};
		}

		if (response.status === 500) {
			return {
				data: null,
				message: 'Error interno del servidor',
				status: response.status
			};
		}

		const data: Response = await response.json();
		return {
			data: data.data,
			message: data.message,
			status: response.status
		};
	} catch (error) {
		console.error('Error al procesar la respuesta:', error);
		return {
			data: null,
			message: 'Error al procesar la respuesta del servidor',
			status: response.status
		};
	}
}