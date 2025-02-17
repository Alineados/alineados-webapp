import { ProblemService } from '$lib/services/personal/problems';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { Thought, ThoughtUpdate } from '$lib/interfaces';
import { ThoughtService } from '$lib/services/personal/thoughts';
import { getJSONFormsData } from '$lib/utils/getFormsData';

export const load: PageServerLoad = async ({ params, request, url, locals }) => {
	// get params
	const { id } = params;

	console.log('id', id);

	const thoughtService: ThoughtService = ThoughtService.getInstance(locals.token);

	const result = await thoughtService.getThoughtInfo(id);

	console.log('result', result.data);

	return {
		thought: result.data
	};
};

export const actions = {
	update: async ({ cookies, request, locals }) => {
		const formData = await request.formData();
		const data = getJSONFormsData(formData);

		console.log('DATA', data);

		const thought: Thought = JSON.parse(data.thought);

		console.log('thought', data.thought);

		const thoughtService: ThoughtService = ThoughtService.getInstance(locals.token);

		const thoughtUpdate: ThoughtUpdate = {
			pfid: thought.pfid,
			ppid: thought.ppid,
			thought_name: thought.thought_name,
			pillar_name: thought.pillar_name,
			purpose_name: thought.purpose_name,
			quuality_time: thought.quuality_time
		};

		console.log('thought.id = ', thought.id);
		console.log('thoughtUpdate', thoughtUpdate);

		const result = await thoughtService.updateThoughtInfo(thought.id, thoughtUpdate);

		if (result.status !== 200 && result.status !== 201) {
			return fail(result.data);
		}

		console.log('result', result);

		return result;
	}
	// upload: async ({ cookies, request, locals }) => {
	//     const formData = Object.fromEntries(await request.formData());

	//     console.log('formData', formData);
	//     if (
	//         !(formData.fileToUpload as File).name ||
	//         (formData.fileToUpload as File).name === 'undefined'
	//     ) {
	//         return fail(400, {
	//             error: true,
	//             message: 'Debe subir un archivo'
	//         });
	//     }

	//     // get id's if they exist
	//     let pcid: string = "";
	//     if (formData.pcid) {
	//         pcid = formData.pcid as string; // problem card id
	//     }

	//     // get file
	//     const file = formData.fileToUpload as File;

	//     let problemService: ProblemService = ProblemService.getInstance('');

	//     const result = await problemService.uploadFile(locals.user._id!, pcid, file);

	//     console.log('result', result);

	//     if (result.status !== 200 && result.status !== 201) {
	//         return fail(result.data);
	//     }

	//     return result;
	// }
} satisfies Actions;
