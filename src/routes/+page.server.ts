import {
    CLIENT_SECRET,
    CODE_VERIFIER,
    CODE_CHALLENGE,
    CLIENT_ID,
    ISSUER,
    REDIRECT_URI //@ts-ignore
} from '$env/static/private';

import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { Oidc } from '$lib/services/oidc/oidc';
import { AuthService } from '$lib/services/auth';
import { fail } from 'assert';

export const load: PageServerLoad = async (event) => {

    throw redirect(307, '/personal/problems');
}


/** @type {import('./$types').Actions} */
export const actions = {
    logout: async ({ locals, cookies }) => {
        const oidc = new Oidc({
            issuer: ISSUER,
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            codeVerifier: CODE_VERIFIER,
            codeChallenge: CODE_CHALLENGE,
            publicRedirectURI: REDIRECT_URI
        });

        if (locals && locals.user) {

            const result = await oidc.logout(locals.user._id!);

            // delete cookies
            cookies.delete('session', { path: '/' });
            const redirect_url = oidc.generateAuthorizationUrl();
            if (result.status === 200 && redirect_url) throw redirect(302, redirect_url);

        }
    }
}