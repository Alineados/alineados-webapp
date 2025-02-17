import { ProblemService } from '$lib/services/personal/problems';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { Documents, Story, StoryUpdate, StoryWithBanner } from '$lib/interfaces';
import { StoryService } from '$lib/services/personal/stories';
import { getJSONFormsData } from '$lib/utils/getFormsData';

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


} satisfies Actions;
