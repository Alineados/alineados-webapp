import { ProblemService } from '$lib/services/personal/problems';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { Documents, StoryWithBanner } from '$lib/interfaces';
import { StoryService } from '$lib/services/personal/stories';

export const load: PageServerLoad = async ({ params, request, url, locals }) => {
    // get params
    const { id } = params;

    // get story
    let storyService: StoryService = StoryService.getInstance(locals.token);

    const result = await storyService.getStoryInfo(id);

    const { story, banner_url } = result.data as unknown as StoryWithBanner;

    return {
        story,
        banner_url
    }
};

export const actions = {
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
