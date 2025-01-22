
import { ProblemService } from '$lib/services/personal/problems';
import type { LayoutServerLoad } from './$types';

export const load:LayoutServerLoad  = async () => {
	// use id
	const user_id = '1';
	const health_id = '1';
	const relational_id = '2';
	const vocational_id = '3';
	const spiritual_id = '4';
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
