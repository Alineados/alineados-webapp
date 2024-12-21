// Onboarding interfaces
export type OnboardingData = {
	register: Register;
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

// Validation interfaces
export type OnboardingValidation = {
	register: RegisterValidation;
};

// Register validation interface
export type RegisterValidation = {
	firstName: ValidationState;
	lastName: ValidationState;
	email: ValidationState;
	countryOfResidence: ValidationState;
	countryOfBirth: ValidationState;
	birthday: ValidationState;
	phoneNumber: ValidationState;
	whatsappNumber: ValidationState;
};

interface ValidationState {
	isWrong: boolean;
	errorType: RegisterValidationType;
}

export enum RegisterValidationType {
	ALL_GOOD = 'allGood',
	REQUIRED = 'isRequired',
	INVALID_NAME = 'isInvalidName',
	IS_TOO_LONG = 'isTooLong',
	INVALID_EMAIL = 'isInvalidEmail',
	REQUIRED_PHONE_CODE = 'isRequiredPhoneCode',
	INVALID_PHONE_NUMBER = 'isNumberInvalid'
}

// Validation error type
export type ValidationError = {
	field: keyof RegisterValidation;
	errorType: RegisterValidationType;
};

// Register validation response
export interface APIResponse {
	type: 'error';
	button: string;
	validations: ValidationError[];
	message: string;
}
