import { ProblemService } from '$lib/services/problems';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, request, url }) => {
	// get from params the pid
	const pid = url.searchParams.get('pid');
	const pillar_name = url.searchParams.get('pillar_name');

	
	if (!pid) return console.error('No pid provided');

	let problemService: ProblemService = ProblemService.getInstance('');
	const result = await problemService.getProblemInfo(pid);

	console.log('get inside the server load', pid, pillar_name);

	
	return {
		problemInfo: result.data.problem_info,
		problemCard: result.data.problem_card,
		pillar_name: pillar_name
	};
};
