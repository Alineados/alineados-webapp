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
