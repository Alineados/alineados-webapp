import type { ValidationType } from './Onboarding.interface';

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
