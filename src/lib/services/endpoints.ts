const endpoints = {
	sandbox: {
		auth: 'https://sandbox-auth-service-808905282606.us-central1.run.app',
		problems: 'https://sandbox-problems-service-808905282606.us-central1.run.app',
		pillars: ' ', // TODO
		socket: 'wss://sandbox-socket-service-808905282606.us-central1.run.app',
		stories: 'http://127.0.0.1:8080',
		oidc: 'https://oidc.alineado.org',
		web: 'https://sandbox.alineado.org'
	},
	prod: {
		problems: '',
		pillars: ' ', // TODO
		auth: '',
		oidc: 'https://oidc.alineado.org'
	},
	local: {
		auth: 'http://127.0.0.1:8080',
		pillars: 'http://127.0.0.1:3001',
		problems: 'http://127.0.0.1:8080',
		stories: 'ttp://127.0.0.1:8080',
		socket: 'ws://localhost:4001',
		oidc: 'https://oidc.alineado.org',
		web: 'http://localhost:5173'
	}
};

type Venv = 'sandbox' | 'prod' | 'local';

export const getEndpointByVenv = () => {
	const env: Venv = 'local';

	return endpoints[env];
};
