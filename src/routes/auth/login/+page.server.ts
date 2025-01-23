import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const uid = url.searchParams.get('uid');

	return {
		post: {
			uid
		}
	};
};
