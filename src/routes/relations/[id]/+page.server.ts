import type { PageServerLoad } from './$types.js';
import { RelationService } from '$lib/services/relations/relations';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
    try {
        const relationId = params.id;
        const token = locals.token || '';
        const uid = locals.user?._id || '';
        
        if (!token || !uid) {
            console.error('❌ No token or user ID available');
            throw error(401, 'Authentication required');
        }
        
        const relationService = RelationService.getInstance(token);
        
        // Get relation data from backend
        const [relationResponse, areasResponse] = await Promise.all([
            relationService.getRelation(relationId, uid),
            relationService.getAreas(uid)
        ]);
        
        if (relationResponse.status !== 200 || !relationResponse.data) {
            console.error('❌ Error getting relation:', relationResponse.error);
            throw error(404, 'Relation not found');
        }
        
        if (areasResponse.status !== 200) {
            console.error('❌ Error getting areas:', areasResponse.error);
        }

        return {
            relation: relationResponse.data,
            areas: areasResponse.data || [],
            uid
        };
        
    } catch (err) {
        console.error('❌ Error in relation view load:', err);
        if (err instanceof Error && err.message.includes('401')) {
            throw err;
        }
        throw error(500, 'Failed to load relation data');
    }
};