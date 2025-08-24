import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
    return {
        user: event.locals.user,
        token: event.locals.token || event.cookies.get('auth_token') || ''
    };
};