// src/routes/personal/pillars/+page.server.ts
import type { PageServerLoad } from './$types';
import { AuthService } from '$lib/services/auth'; // Ajusta la ruta a tu AuthService

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;

  // Verificamos que haya usuario
  if (!user) {
    // Puedes redirigir a login o manejar el error
    // throw redirect(302, '/login');
  }

  // Instanciamos AuthService y obtenemos los pilares
  const authService = AuthService.getInstance('');
  const pillarsResponse = await authService.getPillars(user._id!);

  // Suponiendo que pillarsResponse.data tiene la estructura:
  // {
  //   health: { name: "Salud", categories: [...] },
  //   relational: { name: "Relaciones", categories: [...] },
  //   vocational: { name: "Vocación", categories: [...] },
  //   spiritual: { name: "Espiritual", categories: [...] }
  // }

  return {
    pillars: pillarsResponse.data
  };
};