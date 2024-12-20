import { onboardingStore } from '$lib/stores/onboarding/steps';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	const stepId = url.pathname.split('/').pop() as '1' | '2' | '3' | '4';
	onboardingStore.setStep(stepId);

	return {
		step: stepId
	};
};
