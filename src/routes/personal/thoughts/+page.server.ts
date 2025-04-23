import { getJSONFormsData } from '$lib/utils/getFormsData';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { ThoughtService } from '$lib/services/personal/thoughts';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, request, url, locals }) => {
	// get story
	const thoughtService: ThoughtService = ThoughtService.getInstance(locals.token);

	const result = await thoughtService.getThoughtsGrouped(locals.user._id!);

	return {
		...result.data
	};
};

export const actions = {
	new: async ({ cookies, request, locals }) => {
		const thoughtService: ThoughtService = ThoughtService.getInstance(locals.token);

		const result = await thoughtService.createThought(locals.user._id!);

		if (result.status !== 200 && result.status !== 201) {
			return fail(result.data);
		}

		return result;
	},
	updateImportant: async ({ cookies, request, locals }) => {
		const formData = await request.formData();
		const data = getJSONFormsData(formData);

		const { tid, isImportant } = data;

		const thoughtService: ThoughtService = ThoughtService.getInstance(locals.token);

		const result = await thoughtService.updateIsImportant(tid, isImportant);

		if (result.status !== 200 && result.status !== 201) {
			return fail(result.data);
		}
		return result;
	},
	delete: async ({ params, request, locals }) => {
		const formData = await request.formData();
		const data = getJSONFormsData(formData);

		const { tid } = data;

		const thoughtService: ThoughtService = ThoughtService.getInstance(locals.token);

		const result = await thoughtService.deleteThought(tid);

		if (result.status !== 200 && result.status !== 201) {
			return fail(result.data);
		}
		return result;
	}
} satisfies Actions;
