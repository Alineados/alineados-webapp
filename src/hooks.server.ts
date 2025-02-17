import { Encrypt } from '$lib/utils/encrypt';
import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';
import { SessionManager } from '$lib/services/oidc/session';

// envs
import { SECRET_KEY } from '$env/static/private';
import {
	ISSUER,
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI,
	CODE_VERIFIER,
	CODE_CHALLENGE // @ts-ignore
} from '$env/static/private';
import type { PillarsAndCategories, UserInfo } from '$lib/interfaces';
import { AuthService } from '$lib/services/auth';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('============================================');
	console.log(event.url.pathname);
	console.log('============================================');

	if (event.url.pathname.startsWith('/auth') || event.url.pathname.startsWith('/onboarding'))
		return resolve(event);

	// clean cookies
	event.cookies.delete('_session', { path: '/' });
	event.cookies.delete('_session.legacy', { path: '/' });
	event.cookies.delete('_session.legacy.sig', { path: '/' });
	event.cookies.delete('_session.sig', { path: '/' });

	// encrypt secret key
	const encripter = new Encrypt(SECRET_KEY);

	// auth logic
	let session;
	const sessionManager = new SessionManager({
		issuer: ISSUER,
		clientID: CLIENT_ID,
		clientSecret: CLIENT_SECRET,
		publicRedirectURI: REDIRECT_URI,
		codeVerifier: CODE_VERIFIER,
		codeChallenge: CODE_CHALLENGE
	});

	const code = event.url.searchParams.get('code');

	console.log('code', code);

	const cookie = event.cookies.get('session');
	if (!cookie && !code) {
		console.log('Redirecting: No code & session cookie founded');
		throw redirect(307, sessionManager.authURL);
	} // redirect to login

	session = sessionManager.decryptedSession(cookie, encripter.decrypt);
	if (!sessionManager.isSession(session) && code) {
		session = await sessionManager.getSession(code); // if not, try to create one
	}

	if (!session || sessionManager.isAuthorizationUrl(session)) {
		console.log('Redirecting: no session created or present in cookie');
		throw redirect(307, sessionManager.authURL); // if there is no session redirect to login
	}

	// up to now a session exist
	const sessionUserInfo = await sessionManager.getSessionInfo(session);
	if (sessionManager.isAuthorizationUrl(sessionUserInfo)) {
		// validate if user info exist
		event.cookies.delete('session', { path: '/' });
		throw redirect(307, sessionManager.authURL); // redirect to login
	}

	const encrypt = encripter.encrypt(JSON.stringify(session));
	event.cookies.set('session', `${encrypt.iv}$${encrypt.content}`, {
		path: '/',
		maxAge: parseInt(session.expires_in)
	});

	if (!sessionUserInfo) {
		event.cookies.delete('session', { path: '/' });
		throw redirect(307, sessionManager.authURL); // redirect to login
	}

	// logs
	// console.log('============================================');
	// console.log('session', session);
	// console.log('sessionUserInfo', sessionUserInfo);
	// console.log('============================================');

	const user = sessionUserInfo.profile as unknown as UserInfo;

	// get pillars
	const authService: AuthService = AuthService.getInstance('');
	const pillars = await authService.getPillars(user._id!);

	// set locals
	event.locals.token = session.access_token;
	event.locals.user = user;
	event.locals.pillars = pillars.data as PillarsAndCategories;

	// Return resolve
	return resolve(event);
};

// Execute this function before every request
// export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
// 	const { locals } = event;
// 	if (!request.url.startsWith(ISSUER)) {
// 		// clone the original request, but change the URL
// 		console.info('set authorization header');
// 		if (locals.token) {
// 			request.headers.set('Authorization', `Bearer ${locals.token}`);
// 		}
// 	}

// 	return fetch(request);
// };
