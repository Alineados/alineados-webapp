export const endpoints = {
	sandbox: {
		problems: 'https://sandbox-auth-service-808905282606.us-central1.run.app',
		auth: 'https://sandbox-problems-service-808905282606.us-central1.run.app',
		stories: '',
	},
	prod: {
		problems: '',
		auth: ''
	},
	local: {
		problems: 'http://127.0.0.1:8081',
		auth: 'http://127.0.0.1:8080',
		stories: 'ttp://127.0.0.1:8080',
	}
};
