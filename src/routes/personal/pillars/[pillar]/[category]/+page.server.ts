import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const pillar = params.pillar;
    const category = params.category;
    const userId = locals.user._id;

    // Here you can add logic to load the specific pillar data
    // from your backend service

    return {
        pillar,
        category,
        userId
    };
};