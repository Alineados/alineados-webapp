import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { LoginData, LoginValidation } from '$lib/interfaces/Auth.interface';
import { AuthService } from '$lib/services/auth';
import { ValidationType, type ValidationError } from '$lib/interfaces/Validations.interface';

const authService: AuthService = AuthService.getInstance('');

export const actions = {
	login: async ({ request }) => {
		// Get form data
		const formData = await request.formData();
		const dataJSON = JSON.parse(formData.get('data')?.toString() ?? '{}') as LoginData;
		console.log('Received login data:', dataJSON);

		// Basic fields validation
		const basicFields: (keyof LoginValidation)[] = ['identifier', 'password'];

		//  Validate the data
		const invalidFields: ValidationError[] = [];

		// Check if the fields are empty
		basicFields.forEach((field) => {
			if (!dataJSON[field]) {
				console.log('Field is empty:', field);
				invalidFields.push({
					field,
					errorType: ValidationType.REQUIRED
				});
			}
		});

		// Return the error if there are any
		if (invalidFields.length > 0) {
			console.log('Invalid fields:', invalidFields);
			return {
				type: 'error',
				validation: ValidationType.REQUIRED,
				message: 'Check the fields'
			};
		}

		console.log('Fields are valid');

		// Call the service
		const result = await authService.loginUsers({
			identifier: dataJSON.identifier,
			password: dataJSON.password
		});

		console.log('Login result:', result);

		if (!result.data) {
			return {
				type: 'error',
				validation: ValidationType.INVALID_CREDENTIALS,
				message: 'Invalid credentials'
			};
		}

		console.log('Login successful');

		// For now, just redirect
		redirect(307, '/dashboard');
	}
} satisfies Actions;

export const load: PageServerLoad = ({ url }) => {
	const uid = url.searchParams.get('uid');

	return {
		post: {
			uid
		}
	};
};
