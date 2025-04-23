import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { RecoverPasswordData } from '$lib/interfaces/Auth.interface';
import { AuthService } from '$lib/services/auth';
import { ValidationType } from '$lib/interfaces/Validations.interface';
import { getEndpointByVenv } from '$lib/services/endpoints';

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

		// Call the service
		const result = await authService.sendResetPasswordEmail({
			email: dataJSON.email
		});

		if (!result.data) {
			return {
				type: 'error',
				validation: ValidationType.USER_NOT_EXISTS,
				message: 'Invalid credentials'
			};
		}

		// For now, just redirect
		redirect(307, '/auth/change-password/2');
	},
	code: async ({ request }) => {
		// Get form data
		const formData = await request.formData();
		const dataJSON = JSON.parse(formData.get('data')?.toString() ?? '{}') as RecoverPasswordData;

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

		// Call the service
		const result = await authService.verifyResetPasswordToken({
			email: dataJSON.email,
			code: dataJSON.code
		});

		if (!result.data) {
			return {
				type: 'error',
				validation: ValidationType.INVALID_CODE,
				message: 'Invalid credentials'
			};
		}

		// For now, just redirect
		redirect(307, '/auth/change-password/3');
	},
	restore: async ({ request }) => {
		const formData = await request.formData();
		const dataJSON = JSON.parse(formData.get('data')?.toString() ?? '{}') as RecoverPasswordData;

		// Check if password is empty
		if (!dataJSON.password) {
			return {
				type: 'error',
				step: 'restore',
				validation: {
					password: ValidationType.REQUIRED,
					confirmPassword: ValidationType.ALL_GOOD
				},
				message: 'Check the fields'
			};
		}

		// Password length validation
		if (dataJSON.password.length < 8) {
			return {
				type: 'error',
				step: 'restore',
				validation: {
					password: ValidationType.IS_TOO_SHORT,
					confirmPassword: ValidationType.ALL_GOOD
				},
				message: 'Check the fields'
			};
		}

		// Special characters validation
		if (!/[0-9!@#$%^&*]/.test(dataJSON.password)) {
			return {
				type: 'error',
				step: 'restore',
				validation: {
					password: ValidationType.DONT_CONTAINS_SPECIAL_CHAR,
					confirmPassword: ValidationType.ALL_GOOD
				},
				message: 'Check the fields'
			};
		}

		// Passwords match validation
		if (!dataJSON.confirmPassword || dataJSON.password !== dataJSON.confirmPassword) {
			return {
				type: 'error',
				step: 'restore',
				validation: {
					password: ValidationType.ALL_GOOD,
					confirmPassword: ValidationType.PASSWORDS_DONT_MATCH
				},
				message: 'Check the fields'
			};
		}

		// Call the service
		const result = await authService.resetPassword({
			email: dataJSON.email,
			password: dataJSON.password
		});

		if (!result.data) {
			return {
				type: 'error',
				validation: ValidationType.USER_NOT_EXISTS,
				message: 'Invalid credentials'
			};
		}

		redirect(307, getEndpointByVenv().web);
	},
	resend: async (event) => {
		const data = await event.request.formData();
		const dataJSON = JSON.parse(data.get('data')?.toString() ?? '{}') as RecoverPasswordData;

		// Call the service
		const result = await authService.resendResetPasswordEmail({
			email: dataJSON.email
		});


	}
} satisfies Actions;
