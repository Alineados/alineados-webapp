// Button actions
export const ButtonAction = new Map([
	['1', 'register'],
	['2', 'email'],
	['3', 'password'],
	['4', 'finish']
]);

// Onboarding interfaces
export type OnboardingData = {
	register: Register;
	emailVerification: Email;
};

// Register interface
export interface PhoneNumber {
	code: string;
	number: string;
}

export type Register = {
	firstName: string;
	lastName: string;
	email: string;
	countryOfResidence: string;
	countryOfBirth: string;
	birthday: string;
	phoneNumber: PhoneNumber;
	whatsappNumber: PhoneNumber;
};

// Email verification interface
export type Email = {
	code: string;
};

// Validation interfaces
export type OnboardingValidation = {
	register: RegisterValidation;
	email: EmailValidation;
};

// Register validation interface
export type RegisterValidation = {
	firstName: ValidationType;
	lastName: ValidationType;
	email: ValidationType;
	countryOfResidence: ValidationType;
	countryOfBirth: ValidationType;
	birthday: ValidationType;
	phoneNumber: ValidationType;
	whatsappNumber: ValidationType;
};

// Email verification validation interface
export type EmailValidation = {
	code: ValidationType;
};

// Enum for validation types
export enum ValidationType {
	// Default validation
	ALL_GOOD = 'allGood',
	REQUIRED = 'isRequired',

	// Register validation
	INVALID_NAME = 'isInvalidName',
	IS_TOO_LONG = 'isTooLong',
	INVALID_EMAIL = 'isInvalidEmail',
	REQUIRED_PHONE_CODE = 'isRequiredPhoneCode',
	INVALID_PHONE_NUMBER = 'isNumberInvalid',

	// Email validation
	IS_TOO_SHORT = 'isTooShort',
	INVALID_CODE = 'isInvalidCode'
}

// Validation error for server response
export type ValidationError = {
	field: keyof RegisterValidation | keyof EmailValidation;
	errorType: ValidationType;
};
