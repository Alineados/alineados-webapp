import type { PageServerLoad } from './$types.js';
import { RelationService } from '$lib/services/relations/relations';

export const load: PageServerLoad = async ({ locals, url }) => {
    try {
        const token = locals.token || '';
        const uid = locals.user?._id || '';
        
        if (!token || !uid) {
            console.error('❌ No token or user ID available');
            // Return empty data for unauthenticated users
            return {
                relations: [],
                areas: [],
                uid: ''
            };
        }
        
        const relationService = RelationService.getInstance(token);
        
        // Get list of relations and areas from backend
        const [relationsResponse, areasResponse] = await Promise.all([
            // Use the list endpoint for optimized relation data
            relationService.getRelationsList(uid, 100),
            relationService.getAreas(uid)
        ]);
        
        console.log('🔍 Relations Home - Relations response:', relationsResponse);
        console.log('🔍 Relations Home - Areas response:', areasResponse);
        
        let relationsList = [] as any[];
        if (relationsResponse.status === 200 && relationsResponse.data) {
            // Backend returns { relations: [...], total, page, ... }
            relationsList = (relationsResponse.data.relations || []).map((r: any) => ({
                ...r,
                id: r.id || r._id,
            }));
        }
        
        let areasList = [];
        if (areasResponse.status === 200 && areasResponse.data) {
            areasList = areasResponse.data;
        }
        
        return {
            relations: relationsList,
            areas: areasList,
            uid
        };
        
    } catch (error) {
        console.error('❌ Error in relations home load:', error);
        return {
            relations: [],
            areas: [],
            uid: ''
        };
    }
};
