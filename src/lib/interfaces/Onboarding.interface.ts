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
	email: Email;
	password: Password;
};

// Register interface
export interface PhoneNumber {
	code: string;
	number: string;
}

export type Register = {
	contactNotRequired: boolean;
	firstName: string;
	lastName: string;
	email: string;
	countryOfResidence: string;
	countryOfBirth: string;
	birthday: string;
	phoneNumber: PhoneNumber;
	whatsappNumber: PhoneNumber;
	username: string;
};

// Email verification interface
export type Email = {
	code: string;
};

// Password verification interface
export type Password = {
	password: string;
	confirmPassword: string;
};

// Validation interfaces
export type OnboardingValidation = {
	register: RegisterValidation;
	email: EmailValidation;
	password: PasswordValidation;
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
	username: ValidationType;
};

// Email verification validation interface
export type EmailValidation = {
	code: ValidationType;
};

// Password verification validation interface
export type PasswordValidation = {
	password: ValidationType;
	confirmPassword: ValidationType;
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
	INVALID_CODE = 'isInvalidCode',

	// Password validation
	INVALID_PASSWORD = 'isInvalidPassword',
	PASSWORDS_DONT_MATCH = 'passwordsDontMatch'
}

// Validation error for server response
export type ValidationError = {
	field: keyof RegisterValidation | keyof EmailValidation | keyof PasswordValidation;
	errorType: ValidationType;
};
