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

	const thoughtService: ThoughtService = ThoughtService.getInstance(locals.token);

	const result = await thoughtService.getThoughtInfo(id);

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
			quuality_time: thought.quality_time
		};

		console.log('thought.id = ', thought.id);
		console.log('thoughtUpdate', thoughtUpdate);

		const result = await thoughtService.updateThoughtInfo(thought.id, thoughtUpdate);

		if (result.status !== 200 && result.status !== 201) {
			return fail(result.data);
		}

		console.log('result', result);

		return result;
	},
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
		let tid: string = '';
		let thoughtType: string = '';
		if (formData.tid) {
			tid = formData.tid as string; //thought id
			thoughtType = formData.thoughtType as string; // quality_time
		}

		// get file
		const file = formData.fileToUpload as File;

		const thoughtService: ThoughtService = ThoughtService.getInstance('');

		const result = await thoughtService.uploadThoughtFileOrAudio(
			locals.user._id!,
			tid,
			'',
			file,
			false
		);

		if (result.status !== 200 && result.status !== 201) return fail(result.data);

		return {
			...result,
			type: 'thought',
			thoughtType
		};
	},
	uploadMultiple: async ({ cookies, request, locals }) => {
		const formData = await request.formData();

		const files = formData.getAll('fileToUpload') as File[];
		if (files.length === 0) {
			return fail(400, {
				error: true,
				message: 'Debe subir un archivo'
			});
		}

		const data = getJSONFormsData(formData);

		const { tid, thoughtType } = data;

		const filesType = files.map((file) => file.type);

		console.log('tid', tid);
		console.log('files', files);
		console.log('filesType', filesType);

		const thoughtService: ThoughtService = ThoughtService.getInstance('');

		const result = await thoughtService.uploadThoughtFiles(locals.user._id!, tid, files, filesType);

		console.log('result', result);

		if (result.status !== 200 && result.status !== 201) return fail(result.data);

		return {
			...result,
			type: 'thought',
			thoughtType
		};
	}
} satisfies Actions;
