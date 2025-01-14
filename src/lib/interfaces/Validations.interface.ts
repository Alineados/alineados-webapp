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
	IS_TOO_LONG = 'isTooLong',
	IS_TOO_SHORT = 'isTooShort',

	// Register validation
	INVALID_NAME = 'isInvalidName',
	INVALID_EMAIL = 'isInvalidEmail',
	REQUIRED_PHONE_CODE = 'isRequiredPhoneCode',
	INVALID_PHONE_NUMBER = 'isNumberInvalid',
	INVALID_USERNAME = 'isInvalidUsername',

	USER_EXISTS = 'userExists',
	EMAIL_EXISTS = 'emailExists',
	PHONE_EXISTS = 'phoneExists',

	// Email validation
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
