// src/routes/personal/pillars/[pillar]/[category]/+page.server.ts
import type { PageServerLoad } from './$types';
import { PillarService } from '$lib/services/personal/pillars';
import type { Categories } from '$lib/interfaces/Pillar.interface';

export const load: PageServerLoad = async (event) => {
  // Obtenemos el id del usuario desde locals
  const user_id = event.locals.user._id!;
  const pillar = event.params.pillar;
  const category = event.params.category;

  // Instanciamos el servicio de pillars
  let pillarService: PillarService = PillarService.getInstance('');

  // Llamamos al método para obtener todos los pilares para el usuario
  const result = await pillarService.getAllPillars(user_id);

  // Buscar la categoría específica en los datos
  let categoryData = null;
  if (result.data && result.data[pillar]) {
    const categories = result.data[pillar].categories;
    categoryData = categories.find((cat: Categories) => 
      cat.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 
      category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );
  }

  return {
    categoryData,
    pillarType: pillar,
    pillars: result.data
  };
};