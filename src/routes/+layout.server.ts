
import type { LayoutServerLoad, PageServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {

    return {
        user: event.locals.user,
        pillars: event.locals.pillars,
        token: event.locals.token
    }
}