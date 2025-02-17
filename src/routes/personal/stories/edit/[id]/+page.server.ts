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

    getUrl: async ({ params, request, locals }) => {
        const formData = await request.formData();
        const data = getJSONFormsData(formData);

        const file: Documents = JSON.parse(data.document);

        let storyService: StoryService = StoryService.getInstance(locals.token);

        const result = await storyService.createDocumentUrl(file);


        if (result.status !== 200 && result.status !== 201) {
            return fail(result.data);
        }

        return result;
    },
    update: async ({ cookies, request, locals }) => {
        const formData = await request.formData();
        const data = getJSONFormsData(formData);

        const story: Story = JSON.parse(data.story);

        let storyService: StoryService = StoryService.getInstance(locals.token);

        const storyUpdate: StoryUpdate = {
            pfid: story.pfid,
            cid: story.cid,
            banner: story.banner,
            story_name: story.story_name,
            pillar_name: story.pillar_name,
            category_name: story.category_name,
            type: story.type,
            involved: story.involved,
            experience: story.experience,
            life_lesson: story.life_lesson,
            is_important: story.is_important
        }

        const result = await storyService.updateStoryInfo(story.id, storyUpdate);

        if (result.status !== 200 && result.status !== 201) {
            return fail(result.data);
        }

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
        let sid: string = "";
        let type: string = "";
        let storyType: string = "";
        if (formData.sid) {
            sid = formData.sid as string; // story id
            storyType = formData.storyType as string; // experience | life_lesson
            type = formData.type as string; // story | ...
        }

        // get file 
        const file = formData.fileToUpload as File;

        let storyService: StoryService = StoryService.getInstance('');

        const result = await storyService.uploadStoryFileOrAudio(locals.user._id!, sid, '', file, storyType === 'banner' ? true : false);

        if (result.status !== 200 && result.status !== 201)
            return fail(result.data);

        return {
            ...result,
            type,
            storyType
        }
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

        const { sid, storyType } = data;

        const filesType = files.map(file => file.type);


        let storyService: StoryService = StoryService.getInstance('');

        const result = await storyService.uploadStoryFiles(locals.user._id!, sid, files, filesType);

        console.log('result', result);

        if (result.status !== 200 && result.status !== 201)
            return fail(result.data);

        return {
            ...result,
            type: "story",
            storyType
        }

    }
} satisfies Actions;
