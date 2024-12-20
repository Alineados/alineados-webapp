import type { OnboardingData } from '$lib/interfaces/onbarding';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	register: async (event) => {
		const data = await event.request.formData();
		const dataJSON = JSON.parse(data.get('data')?.toString() ?? '{}') as OnboardingData;
		console.log(dataJSON);

		//  Validate the data
		const invalidFields: string[] = [];

		if (!dataJSON.register.firstName) {
			invalidFields.push('firstName');
		}

		if (!dataJSON.register.lastName) {
			invalidFields.push('lastName');
		}

		if (!dataJSON.register.countryOfResidence) {
			invalidFields.push('countryOfResidence');
		}

		if (!dataJSON.register.countryOfBirth) {
			invalidFields.push('countryOfBirth');
		}

		if (!dataJSON.register.birthday) {
			invalidFields.push('birthday');
		}

		if (!dataJSON.register.email) {
			invalidFields.push('email');
		}

		if (!dataJSON.register.phoneNumber.number || !dataJSON.register.phoneNumber.code) {
			invalidFields.push('phoneNumber');
		}

		if (!dataJSON.register.whatsappNumber.code || !dataJSON.register.whatsappNumber.number) {
			invalidFields.push('whatsappNumber');
		}

		if (invalidFields.length > 0) {
			return {
				type: 'error',
				button: 'register',
				label: invalidFields,
				message: 'Please fill in all required fields'
			};
		}

		/*
		const res = await fetch('https://api.example.com/register', {
			method: 'post',
			body: data
		});
		

		if (res.ok) {
			const response = await res.json();
			response.type = 'register';
			return response;
		}

		const response = {
			type: 'register',
			message: 'Success'
		};
		*/

		redirect(307, '/onboarding/steps/2');
	},
	finish: async (event) => {
		const data = await event.request.formData();
		console.log(data);
		const register = data.get('data');
		console.log(register);

		// TODO: Implement validations here
		const success = true;

		if (!success) {
			return {
				type: 'error',
				button: 'register',
				message: 'Validation failed'
			};
		}

		const res = await fetch('https://api.example.com/register', {
			method: 'post',
			body: data
		});

		if (res.ok) {
			const response = await res.json();
			response.type = 'register';
			return response;
		}
	}
	// TODO: Implement the rest of the actions
} satisfies Actions;
