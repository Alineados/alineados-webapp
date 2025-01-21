
import { ProblemService } from '$lib/services/problems';
import type { LayoutServerLoad } from './$types';

export const load:LayoutServerLoad  = async () => {
	// use id
	const user_id = '1';
	const health_id = '1';
	const relational_id = '2';
	const vocational_id = '3';
	const spiritual_id = '4';
	console.log('user_id', user_id);
	console.log('health_id', health_id);
	console.log("jp;a")
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
