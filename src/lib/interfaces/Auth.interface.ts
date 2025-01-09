import type { ValidationType } from './Validations.interface';

// Data interface for login data
export type LoginData = {
	identifier: string;
	password: string;
};

// Validate the login data
export type LoginValidation = {
	identifier: ValidationType;
	password: ValidationType;
};

// Data interface for recover password data
export type RecoverPasswordData = {
	email: string;
	code: string;
	password: string;
	confirmPassword: string;
};

// Validate the recover password data
export type RecoverPasswordValidation = {
	email: ValidationType;
	code: ValidationType;
	password: ValidationType;
	confirmPassword: ValidationType;
};
