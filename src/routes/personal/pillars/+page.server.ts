// src/routes/personal/pillars/+page.server.ts
import type { PageServerLoad } from './$types';
import { PillarService } from '$lib/services/personal/pillars';

export const load: PageServerLoad = async (event) => {
  // Obtenemos el id del usuario desde locals
  const user_id = event.locals.user._id!;

  // Instanciamos el servicio de pillars (similar al de problems)
  let pillarService: PillarService = PillarService.getInstance('');

  // Llamamos al método para obtener todos los pilares para el usuario
  const result = await pillarService.getAllPillars(user_id);

  return {
    pillars: result.data
  };
};
