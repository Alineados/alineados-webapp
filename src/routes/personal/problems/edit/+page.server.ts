import { ProblemService } from '$lib/services/personal/problems';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { Documents } from '$lib/interfaces';

export const load: PageServerLoad = async ({ params, request, url, locals }) => {
	// get from params the pid
	const pid = url.searchParams.get('pid');
	const pillar_name = url.searchParams.get('pillar_name');

	if (!pid) return console.error('No pid provided');

	let problemService: ProblemService = ProblemService.getInstance(locals.token || '');
	const result = await problemService.getProblemInfo(pid);

	// get url images
	let urlImages = [];
	let pathsFiltered: Documents[] = result.data.problem_info.memories
		.filter((memory: Documents) => memory.type.startsWith('image'))

	if (pathsFiltered.length > 0) {
		const data = await problemService.getImages(pathsFiltered);
		if (data.status === 200) urlImages = data.data;
	}

	return {
		problemInfo: result.data.problem_info,
		problemCard: result.data.problem_card,
		problemMatrix: result.data.problem_matrix,
		pillar_name: pillar_name,
		urlImages: urlImages,
		token: locals.token
	};
};

export const actions = {
	upload: async ({ cookies, request, locals }) => {
		const formData = Object.fromEntries(await request.formData());

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

		let problemService: ProblemService = ProblemService.getInstance('');

		const result = await problemService.uploadFile(locals.user._id!, pcid, file);

		if (result.status !== 200 && result.status !== 201) {
			return fail(result.data);
		}

		return {
			...result ,
			type:"problems"
		}
	}
} satisfies Actions;
