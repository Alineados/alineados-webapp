const endpoints = {
	sandbox: {
		auth: 'https://sandbox-auth-service-808905282606.us-central1.run.app',
		problems: 'https://sandbox-problems-service-808905282606.us-central1.run.app',
		socket: 'wss://sandbox-socket-service-808905282606.us-central1.run.app',
		stories: '',
		oidc: 'https://oidc.alineado.org',
	},
	prod: {
		problems: '',
		auth: '',
		oidc: 'https://oidc.alineado.org',
	},
	local: {
		auth: 'http://127.0.0.1:8080',
		problems: 'http://127.0.0.1:8080',
		stories: 'ttp://127.0.0.1:8080',
		socket: 'ws://localhost:4001',
		oidc: 'https://oidc.alineado.org',
	}
};

type Venv = 'sandbox' | 'prod' | 'local';

export const getEndpointByVenv = () => {

	const env: Venv = 'sandbox';

	return endpoints[env];
}
