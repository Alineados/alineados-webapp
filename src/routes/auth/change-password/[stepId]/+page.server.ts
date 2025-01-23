import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { RecoverPasswordData } from '$lib/interfaces/Auth.interface';
import { AuthService } from '$lib/services/auth';
import { ValidationType, type ValidationError } from '$lib/interfaces/Validations.interface';

const authService: AuthService = AuthService.getInstance('');

// Regex
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;

export const actions = {
	email: async ({ request }) => {
		// Get form data
		const formData = await request.formData();
		const dataJSON = JSON.parse(formData.get('data')?.toString() ?? '{}') as RecoverPasswordData;
		

		// Return the error if there are any
		if (!dataJSON.email) {
			console.log('Invalid fields:');
			return {
				type: 'error',
				step: 'email',
				validation: ValidationType.REQUIRED,
				message: 'Check the fields'
			};
		} else if (!emailRegex.test(dataJSON.email)) {
			return {
				type: 'error',
				step: 'email',
				validation: ValidationType.INVALID_EMAIL,
				message: 'Check the fields'
			};
		}

		/* 
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
        */

		// For now, just redirect
		redirect(307, '/auth/change-password/2');
	},
	code: async ({ request }) => {
		// Get form data
		const formData = await request.formData();
		const dataJSON = JSON.parse(formData.get('data')?.toString() ?? '{}') as RecoverPasswordData;
		console.log('Received recover data:', dataJSON);

		// Return the error if there are any
		if (!dataJSON.code) {
			return {
				type: 'error',
				step: 'code',
				validation: ValidationType.REQUIRED,
				message: 'Check the fields'
			};
		} else if (dataJSON.code.length !== 6) {
			return {
				type: 'error',
				step: 'code',
				validation: ValidationType.IS_TOO_SHORT,
				message: 'Check the fields'
			};
		}

		/* 
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
        */

		if (dataJSON.code !== '123456') {
			return {
				type: 'error',
				step: 'code',
				validation: ValidationType.INVALID_CODE,
				message: 'Check the fields'
			};
		}

		// For now, just redirect
		redirect(307, '/auth/change-password/3');
	},
	restore: async ({ request }) => {
		// Get form data
		const formData = await request.formData();
		const dataJSON = JSON.parse(formData.get('data')?.toString() ?? '{}') as RecoverPasswordData;
		console.log('Received recover data:', dataJSON);

		//  Validate the data
		const invalidFields: ValidationError[] = [];

		// Check if password is empty
		if (!dataJSON.password) {
			invalidFields.push({
				field: 'password',
				errorType: ValidationType.IS_TOO_SHORT
			});
		} else if (dataJSON.password.length < 8) {
			invalidFields.push({
				field: 'password',
				errorType: ValidationType.IS_TOO_SHORT
			});
		}

		// Password validation for special characters
		if (!/[0-9!@#$%^&*]/.test(dataJSON.password)) {
			invalidFields.push({
				field: 'password',
				errorType: ValidationType.DONT_CONTAINS_SPECIAL_CHAR
			});
		}

		// Password validation for passwords match
		if (!dataJSON.confirmPassword || dataJSON.password !== dataJSON.confirmPassword) {
			invalidFields.push({
				field: 'confirmPassword',
				errorType: ValidationType.PASSWORDS_DONT_MATCH
			});
		}

		// Return the error if there are any
		if (invalidFields.length > 0) {
			return {
				type: 'error',
				step: 'restore',
				validations: invalidFields,
				message: 'Check the fields'
			};
		}

		/* 
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
        */

		// For now, just redirect
		redirect(307, '/auth/login');
	}
} satisfies Actions;
