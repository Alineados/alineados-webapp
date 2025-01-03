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
import { getJSONFormsData } from '$lib/utils/getFormsData';

export const actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const dataJSON = JSON.parse(formData.get('data')?.toString() ?? '{}') as OnboardingData;
		console.log(dataJSON);

		// Regex
		const textRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1]{1,20}$/;
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
		const phoneRegex = /^\d{0,}$/;
		const usernameRegex = /^\S{1,20}$/;

		//  Validate the data
		const invalidFields: ValidationError[] = [];

		// Basic fields validation
		const basicFields: (keyof RegisterValidation)[] = [
			'firstName',
			'lastName',
			'countryOfResidence',
			'countryOfBirth',
			'birthday',
			'username'
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

		// Contact info validation
		if (dataJSON.register.contactNotRequired === false) {
			// Email validation
			if (!dataJSON.register.email) {
				invalidFields.push({
					field: 'email',
					errorType: ValidationType.REQUIRED
				});
			} else if (dataJSON.register.email) {
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
		}

		// Username validation
		const hasUsernameRequiredError = invalidFields.some(
			(error) => error.field === 'username' && error.errorType === ValidationType.REQUIRED
		);

		if (!hasUsernameRequiredError && dataJSON.register.username) {
			if (!usernameRegex.test(dataJSON.register.username)) {
				invalidFields.push({
					field: 'username',
					errorType: ValidationType.INVALID_NAME
				});
			}
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

		const data = getJSONFormsData(formData);

		const { register } = data;

		console.log('data', register);

		// Send the email verification
		const authService: AuthService = AuthService.getInstance('');

		/*
		// Call the service
		const result = await authService.sendEmailVerification({
			userName: dataJSON.register.firstName,
			email: dataJSON.register.email
		});
		*/

		// Call the service
		const result = await authService.registerUser({
			firstName: dataJSON.register.firstName,
			lastName: dataJSON.register.lastName,
			email: dataJSON.register.email,
			countryOfResidence: dataJSON.register.countryOfResidence,
			countryOfBirth: dataJSON.register.countryOfBirth,
			birthday: dataJSON.register.birthday,
			phoneNumber: dataJSON.register.phoneNumber,
			whatsappNumber: dataJSON.register.whatsappNumber,
			username: dataJSON.register.username
		});

		console.log(result);

		if (dataJSON.register.contactNotRequired === false) {
			// Redirect to the next step
			redirect(307, '/onboarding/steps/2');
		} else {
			// Redirect to the next step
			redirect(307, '/onboarding/steps/3');
		}
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
