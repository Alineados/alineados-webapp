import type { PageServerLoad } from './$types.js';
import { error } from '@sveltejs/kit';
import { RelationService } from '$lib/services/relations/relations';
import { createEmptyRelation } from '$lib/stores/relations/relations';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const token = locals.token || '';
        const uid = locals.user?._id || '';
        
        if (!token || !uid) {
            console.error('❌ Authentication required - No token or user ID');
            throw error(401, 'Authentication required');
        }

        console.log('🔍 New Relation Page - Loading with user:', uid);
        
        const relationService = RelationService.getInstance(token);
        
        // Get areas from backend
        let areas = [];
        try {
            const areasResponse = await relationService.getAreas(uid);
            if (areasResponse.status === 200 && areasResponse.data) {
                areas = areasResponse.data;
                console.log('✅ New Relation Page - Areas loaded:', areas.length);
            } else {
                console.warn('⚠️ New Relation Page - Failed to load areas:', areasResponse.error);
            }
        } catch (error) {
            console.error('❌ New Relation Page - Error loading areas:', error);
            // Don't throw, let the page load with empty areas
        }
        
        // Create empty relation dynamically with real uid (no hardcoded data)
        const newEmptyRelation = createEmptyRelation(uid);
        
        console.log('✅ New Relation Page - Returning empty relation for uid:', uid);
        
        return {
            relation: newEmptyRelation,
            areas,
            isNew: true
        };
        
    } catch (err) {
        console.error('❌ New Relation Page - Server error:', err);
        if (err && typeof err === 'object' && 'status' in err) {
            throw err; // Re-throw SvelteKit errors (like our 401)
        }
        throw error(500, 'Failed to load new relation page');
    }
};