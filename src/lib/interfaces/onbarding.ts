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

interface PhoneNumber {
	code: string;
	number: string;
}

export type OnboardingData = {
	register: Register;
};

export type RegisterValidation = {
	firstName: boolean;
	lastName: boolean;
	email: boolean;
	countryOfResidence: boolean;
	countryOfBirth: boolean;
	birthday: boolean;
	phoneNumber: boolean;
	whatsappNumber: boolean;
};

export type OnboardingValidation = {
	register: RegisterValidation;
};
