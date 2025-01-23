import type { OnboardingData, RegisterValidation } from '$lib/interfaces/Onboarding.interface';
import { ValidationType } from '$lib/interfaces/Validations.interface';
import type { ValidationError } from '$lib/interfaces/Validations.interface';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { OnboardingService } from '$lib/services/onboarding';

// Add interface for response
interface ExistingIdentifier {
	type: 'username' | 'email' | 'phoneNumber';
	value: string;
}

// Create the service
const authService: OnboardingService = OnboardingService.getInstance('');

// Normalize string
function normalizeString(str: string): string {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

// Regex
const textRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1]{1,20}$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
const phoneRegex = /^\d{0,}$/;
const usernameRegex = /^\S{1,20}$/;

export const actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const dataJSON = JSON.parse(formData.get('data')?.toString() ?? '{}') as OnboardingData;
		console.log(dataJSON);

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

		if (
			!dataJSON.register.birthday.day ||
			!dataJSON.register.birthday.month ||
			!dataJSON.register.birthday.year
		) {
			if (!usernameRegex.test(dataJSON.register.username)) {
				invalidFields.push({
					field: 'birthday',
					errorType: ValidationType.REQUIRED
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

		// Return the error if there are any
		if (invalidFields.length > 0) {
			return {
				type: 'error',
				step: 'register',
				validations: invalidFields,
				message: 'Check the fields'
			};
		}

		/// Verify if the email or phone number exists
		const verifyData: any = {
			username: dataJSON.register.username
		};

		if (dataJSON.register.email) {
			verifyData.email = dataJSON.register.email;
		}

		if (dataJSON.register.phoneNumber?.code) {
			verifyData.phoneNumber = dataJSON.register.phoneNumber;
		}

		let result = await authService.verifyUserExists(verifyData);

		console.log(result);

		if (result.data.length > 0) {
			const validations = result.data.map((identifier: ExistingIdentifier) => {
				let errorType: ValidationType;

				switch (identifier.type) {
					case 'username':
						errorType = ValidationType.USER_EXISTS;
						break;
					case 'email':
						errorType = ValidationType.EMAIL_EXISTS;
						break;
					case 'phoneNumber':
						errorType = ValidationType.PHONE_EXISTS;
						break;
					default:
						errorType = ValidationType.USER_EXISTS;
				}

				return {
					field: identifier.type as keyof RegisterValidation,
					errorType
				};
			});

			return {
				type: 'error',
				step: 'register',
				validations,
				message: 'Check the fields'
			};
		}

		// Send the verification email
		if (dataJSON.register.contactNotRequired === false) {
			// Call the service
			result = await authService.sendVerificationEmail({
				email: dataJSON.register.email,
				firstName: dataJSON.register.firstName
			});

			console.log(result);

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
			}
		}

		// Return the error if there are any
		if (invalidFields.length > 0) {
			return {
				type: 'error',
				step: 'email',
				validations: invalidFields,
				message: 'Check the fields'
			};
		}

		// Call the service
		const result = await authService.verifyEmail({
			email: dataJSON.register.email,
			code: dataJSON.email.code
		});

		console.log(result);

		if (!result.data) {
			return {
				type: 'error',
				step: 'email',
				validations: [
					{
						field: 'code',
						errorType: ValidationType.INVALID_CODE
					}
				],
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

		// Check if password is empty
		if (!dataJSON.password.password) {
			invalidFields.push({
				field: 'password',
				errorType: ValidationType.IS_TOO_SHORT
			});
		} else if (dataJSON.password.password.length < 8) {
			invalidFields.push({
				field: 'password',
				errorType: ValidationType.IS_TOO_SHORT
			});
		}

		// Normalize password and user data
		const normalizedPassword = normalizeString(dataJSON.password.password);

		// Password validation for name and email
		if (
			normalizedPassword.includes(normalizeString(dataJSON.register.firstName)) ||
			normalizedPassword.includes(normalizeString(dataJSON.register.lastName)) ||
			(dataJSON.register?.email &&
				normalizedPassword.includes(normalizeString(dataJSON.register.email)))
		) {
			invalidFields.push({
				field: 'password',
				errorType: ValidationType.IS_CONTAINS_NAME_EMAIL
			});
		}

		// Password validation for special characters
		if (!/[0-9!@#$%^&*]/.test(dataJSON.password.password)) {
			invalidFields.push({
				field: 'password',
				errorType: ValidationType.DONT_CONTAINS_SPECIAL_CHAR
			});
		}

		// Password validation for passwords match
		if (
			!dataJSON.password.confirmPassword ||
			dataJSON.password.password !== dataJSON.password.confirmPassword
		) {
			invalidFields.push({
				field: 'confirmPassword',
				errorType: ValidationType.PASSWORDS_DONT_MATCH
			});
		}

		// Return the error if there are any
		if (invalidFields.length > 0) {
			return {
				type: 'error',
				step: 'password',
				validations: invalidFields,
				message: 'Check the fields'
			};
		}

		// Call the service
		const result = await authService.createUser({
			firstName: dataJSON.register.firstName,
			lastName: dataJSON.register.lastName,
			email: dataJSON.register.email,
			password: dataJSON.password.password,
			phoneNumber: dataJSON.register.phoneNumber,
			whatsappNumber: dataJSON.register.whatsappNumber,
			countryOfResidence: dataJSON.register.countryOfResidence,
			countryOfBirth: dataJSON.register.countryOfBirth,
			birthday: `${dataJSON.register.birthday.year}-${dataJSON.register.birthday.month}-${dataJSON.register.birthday.day}`,
			username: dataJSON.register.username
		});

		console.log(result);

		// Redirect to the next step
		redirect(307, '/onboarding/steps/4');
	},

	finish: async (event) => {
		const data = await event.request.formData();
		const dataJSON = JSON.parse(data.get('data')?.toString() ?? '{}') as OnboardingData;
		console.log(dataJSON);

		// Redirect to the login page
		redirect(307, 'http://localhost:5173');
	},

	resend: async (event) => {
		const data = await event.request.formData();
		const dataJSON = JSON.parse(data.get('data')?.toString() ?? '{}') as OnboardingData;
		console.log(dataJSON);

		// Call the service
		const result = await authService.sendVerificationEmail({
			email: dataJSON.register.email,
			firstName: dataJSON.register.firstName
		});

		console.log(result);
	}
} satisfies Actions;
