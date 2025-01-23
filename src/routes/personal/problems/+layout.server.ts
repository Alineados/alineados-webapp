
import { ProblemService } from '$lib/services/personal/problems';
import type { LayoutServerLoad } from './$types';

export const load:LayoutServerLoad  = async (event) => {
	// use id
	const user_id = event.locals.user._id!;
	const health_id = event.locals.pillars.health.id;
	const relational_id = event.locals.pillars.relational.id;
	const vocational_id = event.locals.pillars.vocational.id;
	const spiritual_id = event.locals.pillars.spiritual.id;

	// get problems grouped by pillar
	let problemService: ProblemService = ProblemService.getInstance('');

	const result = await problemService.getGroupedProblems(
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
