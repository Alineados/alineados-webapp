// src/routes/personal/pillars/[pillar]/[category]/+page.server.ts
import type { PageServerLoad } from './$types';
import { PillarService } from '$lib/services/personal/pillars';
import { ProblemService } from '$lib/services/personal/problems';
import type { Categories } from '$lib/interfaces/Pillar.interface';

export const load: PageServerLoad = async (event) => {
  // Obtenemos el id del usuario desde locals
  const user_id = event.locals.user._id!;
  const pillar = event.params.pillar;
  const category = event.params.category;

  console.log('🔍 URL Parameters:', { pillar, category, user_id });

  // Instanciamos los servicios
  let pillarService: PillarService = PillarService.getInstance('');
  let problemService: ProblemService = ProblemService.getInstance('');

  // Llamamos al método para obtener todos los pilares para el usuario
  const result = await pillarService.getAllPillars(user_id);

  console.log('🔍 Pillars result status:', result.status);
  console.log('🔍 Available pillars:', Object.keys(result.data || {}));

  // Buscar la categoría específica en los datos
  let categoryData = null;
  if (result.data && result.data[pillar]) {
    const categories = result.data[pillar].categories;
    console.log('🔍 Available categories for pillar:', categories.map((cat: Categories) => ({
      id: cat.id,
      name: cat.name,
      label: cat.label
    })));
    
    console.log('🔍 Looking for category with URL param:', category);
    
    categoryData = categories.find((cat: Categories) => 
      cat.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 
      category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );
    
    if (!categoryData) {
      console.log('🔍 Category not found by label, trying by name...');
      categoryData = categories.find((cat: Categories) => 
        cat.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 
        category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      );
    }
  }

  // Obtener problemas asociados a la categoría
  let associatedProblems = [];
  if (categoryData?.id) {
    try {
      console.log('🔍 Loading problems for category:', categoryData.label);
      
      // Usar los mismos IDs que usa el layout de problemas
      const health_id = event.locals.pillars?.health?.id || result.data?.health?.id || '';
      const relational_id = event.locals.pillars?.relational?.id || result.data?.relational?.id || '';
      const vocational_id = event.locals.pillars?.vocational?.id || result.data?.vocational?.id || '';
      const spiritual_id = event.locals.pillars?.spiritual?.id || result.data?.spiritual?.id || '';

      // Intentar primero con getGroupedProblems (como en el layout)
      let problemsResult = await problemService.getGroupedProblems(
        user_id,
        health_id,
        relational_id,
        vocational_id,
        spiritual_id
      );

      console.log('🔍 Problems API status:', problemsResult.status);

      // Si getGroupedProblems no funciona, intentar con getAllProblems
      if (!problemsResult.data || (!Array.isArray(problemsResult.data) && typeof problemsResult.data !== 'object')) {
        console.log('🔍 Trying getAllProblems fallback...');
        problemsResult = await problemService.getAllProblems(
          user_id,
          health_id,
          relational_id,
          vocational_id,
          spiritual_id
        );
      }

      if (problemsResult.status === 200 && problemsResult.data) {
        let problemsArray = [];
        
        // Si es un objeto agrupado (getGroupedProblems), extraer todos los problemas
        if (typeof problemsResult.data === 'object' && !Array.isArray(problemsResult.data)) {
          // Extraer problemas de todas las categorías
          for (const pillarKey of Object.keys(problemsResult.data)) {
            const pillarProblems = problemsResult.data[pillarKey];
            if (Array.isArray(pillarProblems)) {
              problemsArray.push(...pillarProblems);
            }
          }
        } 
        // Si es un array directo (getAllProblems)
        else if (Array.isArray(problemsResult.data)) {
          problemsArray = problemsResult.data;
        }
        
        if (problemsArray.length > 0) {
          console.log(`🔍 Found ${problemsArray.length} total problems, filtering for category:`, categoryData.id);

          // Filtrar problemas que pertenecen a la categoría actual
          associatedProblems = problemsArray.filter((problem: any) => {
            const problemCid = String(problem.cid);
            const categoryId = String(categoryData.id);
            return problemCid === categoryId;
          });
          
          // Si no encontramos problemas por ID, intentar por nombre de categoría como fallback
          if (associatedProblems.length === 0) {
            console.log('🔍 No problems found by ID, trying by category name...');
            associatedProblems = problemsArray.filter((problem: any) => {
              const problemCategoryName = String(problem.category_name || '').toLowerCase();
              const categoryName = String(categoryData.name || '').toLowerCase();
              const categoryLabel = String(categoryData.label || '').toLowerCase();
              return problemCategoryName === categoryName || problemCategoryName === categoryLabel;
            });
          }
          
          console.log(`✅ Found ${associatedProblems.length} problems for category "${categoryData.label}"`);
        }
        
      } else {
        console.log('🔍 No valid problems data received:', {
          status: problemsResult.status,
          hasData: !!problemsResult.data,
          isArray: Array.isArray(problemsResult.data),
          dataType: typeof problemsResult.data
        });
      }
      
    } catch (error) {
      console.error('❌ Error loading associated problems:', error);
      // No fallar si hay error cargando problemas
    }
  } else {
    console.log('🔍 Cannot load problems - missing data:', {
      hasCategoryData: !!categoryData,
      categoryId: categoryData?.id,
      hasResultData: !!result.data
    });
  }

  return {
    categoryData,
    pillarType: pillar,
    pillars: result.data,
    associatedProblems
  };
};