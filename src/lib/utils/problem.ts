import { goto } from '$app/navigation';
import { ProblemService } from '$lib/services/personal/problems';
import { problemCard, problemInfo } from '$lib/stores';
import { get } from 'svelte/store';

export function isEverythingEmpty() {
    const $problemCard = get(problemCard);
    const $problemInfo = get(problemInfo);
    
    return (
        !$problemCard.problem_name?.trim() &&
        !$problemInfo.problem?.description?.trim() &&
        !$problemInfo.decision_taken?.description?.trim() &&
        $problemInfo.involved.every(i => !i.description?.trim()) &&
        $problemInfo.contexts.every(c => !c.description?.trim()) &&
        $problemInfo.objectives.every(o => !o.description?.trim()) &&
        $problemInfo.alternatives.every(a => !a.description?.trim()) &&
        $problemInfo.action_plan.every(a => !a.description?.trim())
    );
}

export async function deleteEmptyProblem(pid: string, token?: string) {
    if (!pid) {
        throw new Error('No se proporcionó un ID de problema');
    }

    if (!token) {
        throw new Error('No se proporcionó un token de autenticación');
    }

    try {
        console.log('Intentando eliminar problema:', pid);
        console.log('Usando token:', token.substring(0, 10) + '...');
        
        const problemService = ProblemService.getInstance(token);
        const response = await problemService.deleteProblemInfo(pid);
        
        console.log('Respuesta del servidor:', response);
        
        if (response.status === 200) {
            console.log('Problema eliminado exitosamente');
            return response;
        } else {
            console.error('Error en la respuesta del servidor:', response);
            throw new Error(`Error al eliminar el problema: ${response.message || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error al eliminar el problema:', error);
        if (error instanceof Error) {
            throw new Error(`Error al eliminar el problema: ${error.message}`);
        }
        throw new Error('Error desconocido al eliminar el problema');
    }
} 