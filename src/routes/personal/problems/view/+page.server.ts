import { ProblemService } from '$lib/services/problems';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// use id
	const user_id = '1';
	const health_id = '1';
	const relational_id = '2';
	const vocational_id = '3';
	const spiritual_id = '4';

	// get problems grouped by pillar
	const problemService: ProblemService = ProblemService.getInstance('');

	// Call the service
	const result = await problemService.getAllProblems(
		user_id,
		health_id,
		relational_id,
		vocational_id,
		spiritual_id
	);

	return {
		problems: result.data
	};
};
