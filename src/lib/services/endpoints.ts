const endpoints = {
	sandbox: {
		auth: 'https://sandbox-auth-service-808905282606.us-central1.run.app',
		problems: 'https://sandbox-problems-service-808905282606.us-central1.run.app',
		socket: 'wss://sandbox-socket-service-808905282606.us-central1.run.app',
		stories: 'https://sandbox-stories-service-808905282606.us-central1.run.app',
		thoughts: 'http://127.0.0.1:8080',
		oidc: 'https://oidc.alineado.org',
		web: 'https://sandbox.alineado.org',
		settings: 'http://127.0.0.1:8080',
	},
	prod: {
		problems: '',
		auth: '',
		oidc: 'https://oidc.alineado.org',
		settings: 'http://127.0.0.1:8080',
	},
	local: {
		auth: 'http://127.0.0.1:8080',
		problems: 'http://127.0.0.1:8080',
		stories: 'http://127.0.0.1:8080',
		thoughts: 'http://127.0.0.1:8080',
		settings: 'http://127.0.0.1:8080',
		socket: 'ws://localhost:4001',
		oidc: 'https://oidc.alineado.org',
		web: 'http://localhost:5173'
	}
};

type Venv = 'sandbox' | 'prod' | 'local';

export const getEndpointByVenv = () => {
	const env: Venv = 'sandbox';

	return endpoints[env];
};
