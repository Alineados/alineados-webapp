import type { LoginValidation } from './Auth.interface';
import type {
	EmailValidation,
	PasswordValidation,
	RegisterValidation
} from './Onboarding.interface';

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
	IS_CONTAINS_NAME_EMAIL = 'isContainsNameEmail',
	DONT_CONTAINS_SPECIAL_CHAR = 'dontContainsSpecialChar',
	PASSWORDS_DONT_MATCH = 'passwordsDontMatch',

	// Login validation
	INVALID_CREDENTIALS = 'isInvalidCredentials'
}

// Validation error for server response
export type ValidationError = {
	field:
		| keyof RegisterValidation
		| keyof EmailValidation
		| keyof PasswordValidation
		| keyof LoginValidation;
	errorType: ValidationType;
};
