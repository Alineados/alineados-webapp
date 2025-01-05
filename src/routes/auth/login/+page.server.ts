import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { LoginData } from '$lib/interfaces/Auth.interface';
import { AuthService } from '$lib/services/auth';

const authService: AuthService = AuthService.getInstance('');

export const actions = {
	login: async ({ request }) => {
		try {
			// Get form data
			const formData = await request.formData();
			const loginDataJSON = formData.get('data')?.toString();

			if (!loginDataJSON) {
				console.error('No login data provided');
				return fail(400, { error: 'No login data provided' });
			}

			// Parse the JSON data
			const loginData: LoginData = JSON.parse(loginDataJSON);

			// Log the received data
			console.log('Received login data:', loginData);

			// Call the service
			const result = await authService.loginUsers({
				identifier: loginData.identifier,
				password: loginData.password
			});

			console.log('Login result:', result);

			// For now, just redirect
			throw redirect(307, '/dashboard');
		} catch (error) {
			console.error('Login error:', error);
			return fail(500, { error: 'Internal server error' });
		}
	}
} satisfies Actions;
