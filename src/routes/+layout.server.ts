
import type { LayoutServerLoad, PageServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {

    // get from hooks de data
    console.log('============================================');
    console.log('event.locals');
    // console.log(event.locals);
    console.log('============================================');

    return {
        user: event.locals.user,
        pillars: event.locals.pillars
    }
}