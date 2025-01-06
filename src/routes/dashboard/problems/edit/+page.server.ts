import { ProblemService } from '$lib/services/problems';
import type { PageServerLoad } from './$types';
import { getJSONFormsData } from '$lib/utils/getFormsData';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { message } from 'sveltekit-superforms';

export const load: PageServerLoad = async ({ params, request, url }) => {
	// get from params the pid
	const pid = url.searchParams.get('pid');
	const pillar_name = url.searchParams.get('pillar_name');

	if (!pid) return console.error('No pid provided');

	let problemService: ProblemService = ProblemService.getInstance('');
	const result = await problemService.getProblemInfo(pid);

	// console.log('result', result);

	return {
		problemInfo: result.data.problem_info,
		problemCard: result.data.problem_card,
		problemMatrix: result.data.problem_matrix,
		pillar_name: pillar_name
	};
};

export const actions = {
	upload: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());

		console.log('formData', formData);
		if (
			!(formData.fileToUpload as File).name ||
			(formData.fileToUpload as File).name === 'undefined'
		) {
			return fail(400, {
				error: true,
				message: 'Debe subir un archivo'
			});
		}

		// get id's if they exist
		let pcid: string = "";
		if (formData.pcid) {
			pcid = formData.pcid as string; // problem card id
		}

		// get file 
		const file = formData.fileToUpload as File;

		console.log('pcid', pcid);
		console.log('file', file);


		let problemService: ProblemService = ProblemService.getInstance('');

		const result = await problemService.uploadImage("1", pcid, file);

		return result;
	}
} satisfies Actions;
