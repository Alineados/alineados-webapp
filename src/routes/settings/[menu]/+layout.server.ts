import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, params }) => {
	let menu = params?.menu
	return {
		menu
	};
}
