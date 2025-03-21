// import type { PageServerLoad, Actions } from './$types';
// import { PillarService } from '$lib/services/personal/pillars';
// import { fail } from '@sveltejs/kit';

// export const load: PageServerLoad = async ({ url, locals }) => {
// 	const pillar = url.searchParams.get('pillar');
// 	const cid = url.searchParams.get('cid');
// 	const uid = locals.user._id;

// 	if (!pillar || !cid || !uid) {
// 		return fail(400, { message: "Missing required parameters" });
// 	}

// 	const pillarService = PillarService.getInstance('');
// 	const result = await pillarService.getCategoryInfo(pillar, cid, uid);
	
// 	// Convertir result.data a un objeto plano para que SvelteKit lo acepte
// 	const plainData = JSON.parse(JSON.stringify(result.data));
	
// 	return {
// 		categoryInfo: plainData,
// 		pillar
// 	};
// };

// export const actions: Actions = {
// 	save: async ({ request, url, locals }) => {
// 		const pillar = url.searchParams.get('pillar');
// 		if (!pillar) return fail(400, { message: "Missing pillar parameter" });

// 		const formData = await request.formData();

// 		// Se espera que los arrays se envíen como JSON en los campos del formulario
// 		const catInfo = {
// 			id: formData.get('id') as string, // si está vacío, el backend insertará uno nuevo
// 			cid: formData.get('cid') as string,
// 			uid: locals.user._id,
// 			is_current: true,
// 			elements: JSON.parse(formData.get('elements') as string || "[]"),
// 			objectives: JSON.parse(formData.get('objectives') as string || "[]"),
// 			positive_actions: JSON.parse(formData.get('positive_actions') as string || "[]"),
// 			improve_actions: JSON.parse(formData.get('improve_actions') as string || "[]"),
// 			habits: JSON.parse(formData.get('habits') as string || "[]"),
// 			short_actions: JSON.parse(formData.get('short_actions') as string || "[]"),
// 			middle_actions: JSON.parse(formData.get('middle_actions') as string || "[]"),
// 			long_actions: JSON.parse(formData.get('long_actions') as string || "[]"),
// 			created_at: "", // El backend se encargará de setearlo
// 			updated_at: ""
// 		};

// 		const pillarService = PillarService.getInstance('');
// 		const result = await pillarService.updateCategoryInfo(pillar, catInfo);
// 		if (result.status !== 200 && result.status !== 201) {
// 			return fail(result.status || 400, { message: result.message });
// 		}
// 		return result.data;
// 	}
// };