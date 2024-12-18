import { writable } from 'svelte/store';

export type OnboardingStep = '1' | '2' | '3' | '4';

interface OnboardingState {
	currentStep: OnboardingStep;
	completedSteps: OnboardingStep[];
	formData: {
		personalInfo: {
			firstName: string;
			lastName: string;
			email: string;
		} | null;
		verification: {
			isVerified: boolean;
		} | null;
		password: string | null;
	};
}

const initialState: OnboardingState = {
	currentStep: '1',
	completedSteps: [],
	formData: {
		personalInfo: null,
		verification: null,
		password: null
	}
};

function createOnboardingStore() {
	const { subscribe, set, update } = writable<OnboardingState>(initialState);

	return {
		subscribe,
		setStep: (step: OnboardingStep) => update((state) => ({ ...state, currentStep: step })),
		completeStep: (step: OnboardingStep) =>
			update((state) => ({
				...state,
				completedSteps: [...state.completedSteps, step]
			})),
		reset: () => set(initialState)
	};
}

export const onboardingStore = createOnboardingStore();
