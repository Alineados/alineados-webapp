import { ProblemService } from '$lib/services/personal/problems';
import { getJSONFormsData } from '$lib/utils/getFormsData';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { StoryService } from '$lib/services/personal/stories';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, request, url, locals }) => {

    // get story
    let storyService: StoryService = StoryService.getInstance(locals.token);

    const result = await storyService.getStoriesGrouped(locals.user._id!);




    console.log('result', result.data);


    return {
        ...result.data
    }
};

export const actions = {
    new: async ({ cookies, request, locals }) => {
        // const formData = await request.formData();
        // const data = getJSONFormsData(formData);

//        console.log('new', locals.user._id);

        let storiesService: StoryService = StoryService.getInstance(locals.token);

        const result = await storiesService.createStory(locals.user._id!);

        if (result.status !== 200 && result.status !== 201) {
            return fail(result.data);
        }

        console.log('result', result);

        return result;
    },
    update: async ({ cookies, request, locals }) => {
        const formData = await request.formData();
        const data = getJSONFormsData(formData);

        console.log('update', data);


        return {
            status: 200,
            data: {
                message: 'update'
            }
        }
    }
} satisfies Actions;
