import { ProblemService } from '$lib/services/personal/problems';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({locals}) => {
	// use id
	const user_id = locals.user._id!;
	const health_id = locals.pillars.health.id;
	const relational_id = locals.pillars.relational.id;
	const vocational_id = locals.pillars.vocational.id;
	const spiritual_id = locals.pillars.spiritual.id;


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
