
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ params, request, url, locals }) => {

	// get story
	redirect(307, "/settings/info")


};
