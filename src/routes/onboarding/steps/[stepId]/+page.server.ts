import type {
	OnboardingData,
	ValidationError,
	RegisterValidation,
	PasswordValidation
} from '$lib/interfaces/onbarding';
import { ValidationType } from '$lib/interfaces/onbarding';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { AuthService } from '$lib/services/auth';

export const actions = {
	register: async (event) => {
		const data = await event.request.formData();
		const dataJSON = JSON.parse(data.get('data')?.toString() ?? '{}') as OnboardingData;
		console.log(dataJSON);

		// Regex
		const textRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1]{1,20}$/;
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
		const phoneRegex = /^\d{0,}$/;

		//  Validate the data
		const invalidFields: ValidationError[] = [];

		// Basic fields validation
		const basicFields: (keyof RegisterValidation)[] = [
			'firstName',
			'lastName',
			'email',
			'countryOfResidence',
			'countryOfBirth',
			'birthday'
		];

		// Check if the fields are empty
		basicFields.forEach((field) => {
			if (!dataJSON.register[field]) {
				invalidFields.push({
					field,
					errorType: ValidationType.REQUIRED
				});
			}
		});

		// FirstName validation
		const hasFirstNameRequiredError = invalidFields.some(
			(error) => error.field === 'firstName' && error.errorType === ValidationType.REQUIRED
		);

		if (!hasFirstNameRequiredError && dataJSON.register.firstName) {
			if (dataJSON.register.firstName.length > 20) {
				invalidFields.push({
					field: 'firstName',
					errorType: ValidationType.IS_TOO_LONG
				});
			} else if (!textRegex.test(dataJSON.register.firstName)) {
				invalidFields.push({
					field: 'firstName',
					errorType: ValidationType.INVALID_NAME
				});
			}
		}

		// LastName validation
		const hasLastNameRequiredError = invalidFields.some(
			(error) => error.field === 'lastName' && error.errorType === ValidationType.REQUIRED
		);

		if (!hasLastNameRequiredError && dataJSON.register.lastName) {
			if (dataJSON.register.lastName.length > 20) {
				invalidFields.push({
					field: 'lastName',
					errorType: ValidationType.IS_TOO_LONG
				});
			} else if (!textRegex.test(dataJSON.register.lastName)) {
				invalidFields.push({
					field: 'lastName',
					errorType: ValidationType.INVALID_NAME
				});
			}
		}

		// Email validation
		const hasEmailRequiredError = invalidFields.some(
			(error) => error.field === 'email' && error.errorType === ValidationType.REQUIRED
		);

		if (!hasEmailRequiredError && dataJSON.register.email) {
			if (!emailRegex.test(dataJSON.register.email)) {
				invalidFields.push({
					field: 'email',
					errorType: ValidationType.INVALID_EMAIL
				});
			}
		}
		// Phone number validation
		if (!dataJSON.register.phoneNumber.code) {
			invalidFields.push({
				field: 'phoneNumber',
				errorType: ValidationType.REQUIRED_PHONE_CODE
			});
		} else if (!dataJSON.register.phoneNumber.number) {
			invalidFields.push({
				field: 'phoneNumber',
				errorType: ValidationType.REQUIRED
			});
		} else if (!phoneRegex.test(dataJSON.register.phoneNumber.number)) {
			invalidFields.push({
				field: 'phoneNumber',
				errorType: ValidationType.INVALID_PHONE_NUMBER
			});
		}

		// WhatsApp validation
		if (!dataJSON.register.whatsappNumber.code) {
			invalidFields.push({
				field: 'whatsappNumber',
				errorType: ValidationType.REQUIRED_PHONE_CODE
			});
		} else if (!dataJSON.register.whatsappNumber.number) {
			invalidFields.push({
				field: 'whatsappNumber',
				errorType: ValidationType.REQUIRED
			});
		} else if (!phoneRegex.test(dataJSON.register.whatsappNumber.number)) {
			invalidFields.push({
				field: 'whatsappNumber',
				errorType: ValidationType.INVALID_PHONE_NUMBER
			});
		}

		// Return the error if there are any
		if (invalidFields.length > 0) {
			return {
				type: 'error',
				button: 'register',
				validations: invalidFields,
				message: 'Check the fields'
			};
		}

		// TODO: API CALL
		console.log('Enviando còdigo de verificación al correo electrónico: ', dataJSON.register.email);

		// get problems grouped by pillar
		const authService: AuthService = AuthService.getInstance('');

		// Call the service
		const result = await authService.sendEmailVerification({
			userName: dataJSON.register.firstName,
			email: dataJSON.register.email
		});

		console.log(result);

		// Redirect to the next step
		redirect(307, '/onboarding/steps/2');
	},

	email: async (event) => {
		const data = await event.request.formData();
		const dataJSON = JSON.parse(data.get('data')?.toString() ?? '{}') as OnboardingData;
		console.log(dataJSON);

		// Basic fields validation
		const invalidFields: ValidationError[] = [];

		// Check if the fields are empty
		if (!dataJSON.email.code) {
			invalidFields.push({
				field: 'code',
				errorType: ValidationType.REQUIRED
			});
		}

		// Code validation
		const hasCodeRequiredError = invalidFields.some(
			(error) => error.field === 'code' && error.errorType === ValidationType.REQUIRED
		);

		if (!hasCodeRequiredError && dataJSON.email.code) {
			if (dataJSON.email.code.length !== 6) {
				invalidFields.push({
					field: 'code',
					errorType: ValidationType.IS_TOO_SHORT
				});
			} else if (dataJSON.email.code !== '123456') {
				invalidFields.push({
					field: 'code',
					errorType: ValidationType.INVALID_CODE
				});
			}
		}

		// TODO: API CALL
		console.log('Verificando código de verificación: ', dataJSON.email.code);

		// Return the error if there are any
		if (invalidFields.length > 0) {
			return {
				type: 'error',
				button: 'email',
				validations: invalidFields,
				message: 'Check the fields'
			};
		}

		// Redirect to the next step
		redirect(307, '/onboarding/steps/3');
	},

	password: async (event) => {
		const data = await event.request.formData();
		const dataJSON = JSON.parse(data.get('data')?.toString() ?? '{}') as OnboardingData;
		console.log(dataJSON);

		//  Validate the data
		const invalidFields: ValidationError[] = [];

		// Basic fields validation
		const basicFields: (keyof PasswordValidation)[] = ['password', 'confirmPassword'];

		// Check if the fields are empty
		basicFields.forEach((field) => {
			if (!dataJSON.password[field]) {
				invalidFields.push({
					field,
					errorType: ValidationType.REQUIRED
				});
			}
		});

		// Confirm password validation
		const hasConfirmPasswordRequiredError = invalidFields.some(
			(error) => error.field === 'confirmPassword' && error.errorType === ValidationType.REQUIRED
		);

		if (!hasConfirmPasswordRequiredError && dataJSON.password.confirmPassword) {
			if (dataJSON.password.password !== dataJSON.password.confirmPassword) {
				invalidFields.push({
					field: 'confirmPassword',
					errorType: ValidationType.PASSWORDS_DONT_MATCH
				});
			}
		}

		// Return the error if there are any
		if (invalidFields.length > 0) {
			return {
				type: 'error',
				button: 'password',
				validations: invalidFields,
				message: 'Check the fields'
			};
		}

		// TODO: API CALL
		console.log('Creando usuario con la contraseña: ', dataJSON.password.password);

		// Redirect to the next step
		redirect(307, '/onboarding/steps/4');
	},

	finish: async (event) => {
		const data = await event.request.formData();
		const dataJSON = JSON.parse(data.get('data')?.toString() ?? '{}') as OnboardingData;
		console.log(dataJSON);

		// Redirect to the login page
		redirect(307, '/auth/login');
	}
} satisfies Actions;
