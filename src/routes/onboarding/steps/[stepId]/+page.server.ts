import type { OnboardingData } from '$lib/interfaces/onbarding';
import type { Actions } from './$types';

export const actions = {
	register: async (event) => {
		const data = await event.request.formData();
		const dataJSON = JSON.parse(data.get('data')?.toString() ?? '{}') as OnboardingData;
		console.log(dataJSON);
		// TODO: Implement validations here

		const success = true;

		if (!success) {
			return {
				type: 'error',
				button: 'register',
				message: 'Validation failed'
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
		*/

		const response = {
			type: 'register',
			message: 'Success'
		};

		return response;
	},
	finsh: async (event) => {
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
