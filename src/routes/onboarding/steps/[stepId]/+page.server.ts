import type {
	OnboardingData,
	ValidationError,
	RegisterValidation
} from '$lib/interfaces/onbarding';
import { RegisterValidationType } from '$lib/interfaces/onbarding';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

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
					errorType: RegisterValidationType.REQUIRED
				});
			}
		});

		// FirstName validation
		const hasFirstNameRequiredError = invalidFields.some(
			(error) => error.field === 'firstName' && error.errorType === RegisterValidationType.REQUIRED
		);

		if (!hasFirstNameRequiredError && dataJSON.register.firstName) {
			if (dataJSON.register.firstName.length > 20) {
				invalidFields.push({
					field: 'firstName',
					errorType: RegisterValidationType.IS_TOO_LONG
				});
			} else if (!textRegex.test(dataJSON.register.firstName)) {
				invalidFields.push({
					field: 'firstName',
					errorType: RegisterValidationType.INVALID_NAME
				});
			}
		}

		// LastName validation
		const hasLastNameRequiredError = invalidFields.some(
			(error) => error.field === 'lastName' && error.errorType === RegisterValidationType.REQUIRED
		);

		if (!hasLastNameRequiredError && dataJSON.register.lastName) {
			if (dataJSON.register.lastName.length > 20) {
				invalidFields.push({
					field: 'lastName',
					errorType: RegisterValidationType.IS_TOO_LONG
				});
			} else if (!textRegex.test(dataJSON.register.lastName)) {
				invalidFields.push({
					field: 'lastName',
					errorType: RegisterValidationType.INVALID_NAME
				});
			}
		}

		// Email validation
		const hasEmailRequiredError = invalidFields.some(
			(error) => error.field === 'email' && error.errorType === RegisterValidationType.REQUIRED
		);

		if (!hasEmailRequiredError && dataJSON.register.email) {
			if (!emailRegex.test(dataJSON.register.email)) {
				invalidFields.push({
					field: 'email',
					errorType: RegisterValidationType.INVALID_EMAIL
				});
			}
		}
		// Phone number validation
		if (!dataJSON.register.phoneNumber.code) {
			invalidFields.push({
				field: 'phoneNumber',
				errorType: RegisterValidationType.REQUIRED_PHONE_CODE
			});
		} else if (!dataJSON.register.phoneNumber.number) {
			invalidFields.push({
				field: 'phoneNumber',
				errorType: RegisterValidationType.REQUIRED
			});
		} else if (!phoneRegex.test(dataJSON.register.phoneNumber.number)) {
			invalidFields.push({
				field: 'phoneNumber',
				errorType: RegisterValidationType.INVALID_PHONE_NUMBER
			});
		}

		// WhatsApp validation
		if (!dataJSON.register.whatsappNumber.code) {
			invalidFields.push({
				field: 'whatsappNumber',
				errorType: RegisterValidationType.REQUIRED_PHONE_CODE
			});
		} else if (!dataJSON.register.whatsappNumber.number) {
			invalidFields.push({
				field: 'whatsappNumber',
				errorType: RegisterValidationType.REQUIRED
			});
		} else if (!phoneRegex.test(dataJSON.register.whatsappNumber.number)) {
			invalidFields.push({
				field: 'whatsappNumber',
				errorType: RegisterValidationType.INVALID_PHONE_NUMBER
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

		// Redirect to the next step
		redirect(307, '/onboarding/steps/2');
	},
	finish: async (event) => {
		const data = await event.request.formData();
		console.log(data);
		const register = data.get('data');
		console.log(register);

		// TODO: Implement validations here
		const success = true;

		if (!success) {
			return {
				type: 'error',
				button: 'register',
				message: 'Validation failed'
			};
		}

		const res = await fetch('https://api.example.com/register', {
			method: 'post',
			body: data
		});

		if (res.ok) {
			const response = await res.json();
			response.type = 'register';
			return response;
		}
	}
	// TODO: Implement the rest of the actions
} satisfies Actions;
