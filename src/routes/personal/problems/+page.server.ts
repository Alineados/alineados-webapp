import { ProblemService } from '$lib/services/personal/problems';
import { getJSONFormsData } from '$lib/utils/getFormsData';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	new: async ({ cookies, request, locals }) => {
		const formData = await request.formData();
		const data = getJSONFormsData(formData);

		const { pfid, cid, pillar_name, pillar_label, category_name, category_label } = data;

		let problemService: ProblemService = ProblemService.getInstance('');
		const result = await problemService.createProblemInfo({
			uid: locals.user._id!,
			pfid,
			cid,
			pillar_name: pillar_label,
			category_name: category_label
		});

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


		if (result.status !== 200 && result.status !== 201) {
			return fail(result.data);
		}

		return result;
	}
} satisfies Actions;
