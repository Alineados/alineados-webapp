import { ProblemService } from '$lib/services/problems';
import { getJSONFormsData } from '$lib/utils/getFormsData';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad, LayoutServerData } from './$types';

// export const load: PageServerLoad = async ({ params }) => {
// 	// use id
// 	const user_id = '1';
// 	const health_id = '1';
// 	const relational_id = '2';
// 	const vocational_id = '3';
// 	const spiritual_id = '4';
// 	// get problems grouped by pillar
// 	let problemService: ProblemService = ProblemService.getInstance('');

// 	const result = await problemService.getGroupedProblems(
// 		user_id,
// 		health_id,
// 		relational_id,
// 		vocational_id,
// 		spiritual_id
// 	);

// 	return {
// 		problems: result.data
// 	};
// };

export const actions = {
	new: async ({ cookies, request }) => {
		const formData = await request.formData();
		const data = getJSONFormsData(formData);

		const { pfid, cid, pillar_name, category_name } = data;

		let problemService: ProblemService = ProblemService.getInstance('');
		const result = await problemService.createProblemInfo({
			uid: '1',
			pfid,
			cid,
			pillar_name,
			category_name
		});

		console.log(result);

		if (result.status !== 200 && result.status !== 201) {
			return fail(result.data);
		}

		return result;
	},
	delete: async ({ cookies, request }) => {
		const formData = await request.formData();
		const data = getJSONFormsData(formData);

		const { pid } = data;

		let problemService: ProblemService = ProblemService.getInstance('');
		const result = await problemService.deleteProblemInfo(pid);
		console.log(result);

		if (result.status !== 200 && result.status !== 201) {
			return fail(result.data);
		}

		return result;
	}
} satisfies Actions;
