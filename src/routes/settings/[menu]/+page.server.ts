
import type { PageServerLoad } from "../$types";
import { SettingService } from "$lib/services/settings/settings";
import type { Settings } from "$lib/interfaces/settings/settings-state.interface";

export const load: PageServerLoad = async ({ params, request, url, locals }) => {

	let userId = "1"

	let settingsObj = new SettingService("")
	let settings = await settingsObj.getSettings(userId)

	return {
		settings: settings.data as Settings,
		userId
	}
};
