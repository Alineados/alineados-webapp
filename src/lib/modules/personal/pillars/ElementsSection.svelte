<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    import Cube from '$lib/icons/Cube.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import InformationIcon from '$lib/icons/InformationIcon.svelte';
    import { nanoid } from 'nanoid';
    import { page } from '$app/stores';
    import { currentCategoryInfo } from '$lib/stores/pillar/category';
    import { userState } from '$lib/stores';
    import type { GenericItemDTO } from '$lib/services/personal/pillars';
    import { PillarService } from '$lib/services/personal/pillars';
    import { getContext, onMount } from 'svelte';
    import { getEndpointByVenv } from '$lib/services/endpoints';
    import { toast } from 'svelte-sonner';

    // Obtener el token del contexto
    const token = getContext<string>('token');
    const pillarService = PillarService.getInstance(token || '');

    // Obtener parámetros de la URL
    // TEMPORARILY DISABLED - Usar valores estáticos para aislar el problema
    let pillar = 'health'; // $derived($page.params.pillar || '');
    let category = 'fisica'; // $derived($page.params.category || '');

    // Obtener el ID de la categoría desde el contexto de la página
    let categoryId = '507f1f77bcf86cd799439011'; // $derived($page.data?.categoryData?.id || '');

    // Debug: verificar que tenemos los datos necesarios
    // TEMPORARILY DISABLED - Comentado para evitar bucle infinito
    /*
    $effect(() => {
        console.log('ElementsSection Debug:', {
            pillar,
            category,
            categoryId,
            userStateId: userState.id,
            categoryData: $page.data?.categoryData
        });
    });
    */

    // Estado local
    let elements = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    let isOnlyText = $state(true);
    let isLoading = $state(false);

    // Función para cargar datos existentes
    async function loadElements() {
        console.log('loadElements called with:', { pillar, categoryId, userStateId: userState.id });
        
        if (!userState.id || !categoryId) {
            console.log('Missing required data for loadElements:', { userStateId: userState.id, categoryId });
            isLoading = false;
            return;
        }

        isLoading = true;

        try {
            const response = await pillarService.getCategoryInfo(pillar, categoryId, userState.id);
            console.log('loadElements response:', response);

            if (response.status === 200 && response.data) {
                const categoryInfo = response.data;
                
                // Actualizar el store global
                $currentCategoryInfo = categoryInfo;

                // Convertir los elementos del backend al formato del frontend
                // Filtrar elementos vacíos del backend
                if (categoryInfo.elements && categoryInfo.elements.length > 0) {
                    const nonEmptyElements = categoryInfo.elements
                        .filter((item: GenericItemDTO) => item.description && item.description.trim() !== '')
                        .map((item: GenericItemDTO) => ({
                            id: item.id || nanoid(),
                            description: item.description,
                            prominent: item.favorite,
                            daily: item.repeated
                        }));
                    
                    // Asegurar que siempre haya exactamente un elemento vacío al final
                    elements = [...nonEmptyElements, { id: nanoid(), description: '', prominent: false, daily: false }];
                } else {
                    // Si no hay datos o todos están vacíos, crear un solo elemento vacío
                    elements = [{ id: nanoid(), description: '', prominent: false, daily: false }];
                }
            } else {
                // Si no hay datos, crear un elemento vacío
                elements = [{ id: nanoid(), description: '', prominent: false, daily: false }];
            }
        } catch (error) {
            console.error('Error loading elements:', error);
            // Si hay error, crear un elemento vacío
            elements = [{ id: nanoid(), description: '', prominent: false, daily: false }];
        } finally {
            isLoading = false;
        }
    }

    // Función para guardar cuando el usuario pierde el foco
    function handleBlur() {
        // TEMPORARILY DISABLED - No autosave for now
        console.log('Blur event - autosave disabled');
    }

    // Función para actualizar el store global cuando cambian los elementos
    function updateGlobalStore() {
        const items = convertToGenericItems();
        if ($currentCategoryInfo) {
            $currentCategoryInfo.elements = items;
        }
    }

    // Efecto para actualizar el store global cuando cambian los elementos
    // TEMPORARILY DISABLED - Comentado para evitar bucle infinito
    /*
    $effect(() => {
        updateGlobalStore();
    });
    */

    // Guardar al salir de la página
    onMount(() => {
        loadElements();
    });

    function toggleProminent(id: string) {
        elements = elements.map(e => 
            e.id === id ? { ...e, prominent: !e.prominent } : e
        );
    }

    function toggleDaily(id: string) {
        elements = elements.map(e => 
            e.id === id ? { ...e, daily: !e.daily } : e
        );
    }

    // Función para convertir elementos al formato del backend
    function convertToGenericItems(): GenericItemDTO[] {
        return elements
            .filter(e => e.description.trim() !== '') // Solo elementos con contenido
            .map(e => ({
                id: e.id,
                description: e.description,
                done: false,
                favorite: e.prominent,
                repeated: e.daily,
                deleted: false
            }));
    }

    function addElement(id: string) {
        // Agregar un nuevo elemento al final
        const newElement = { id: nanoid(), description: '', prominent: false, daily: false };
        elements = [...elements, newElement];
    }

    function removeElement(id: string) {
        // No eliminar si es el último elemento y está vacío
        if (elements.length === 1 && elements[0].description === '') {
            return;
        }
        
        // Eliminar el elemento
        elements = elements.filter(e => e.id !== id);
        
        // Asegurar que siempre haya al menos un elemento vacío al final
        if (elements.length === 0 || elements[elements.length - 1].description !== '') {
            elements = [...elements, { id: nanoid(), description: '', prominent: false, daily: false }];
        }
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <Cube styleTw="size-6 text-alineados-gray-900" />
        <h2 class="text-2xl font-medium text-alineados-gray-900">Elementos</h2>
        <Tooltip
            open={false}
            html={`
                <div class="text-xs text-alineados-blue-900 space-y-3 p-2">
                    <div>
                        <p class="font-semibold mb-2">Cada categoría se puede componer de varias partes; estos son algunos ejemplos por cada una:</p>
                    </div>
                    
                    <div>
                        <table class="w-full text-xs border-collapse">
                            <thead>
                                <tr class="bg-gray-100">
                                    <th class="border border-gray-300 px-2 py-1 text-left">Pilar</th>
                                    <th class="border border-gray-300 px-2 py-1 text-left">Categoría</th>
                                    <th class="border border-gray-300 px-2 py-1 text-left">Elementos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1 font-semibold bg-blue-50" rowspan="2">Salud</td>
                                    <td class="border border-gray-300 px-2 py-1">Física</td>
                                    <td class="border border-gray-300 px-2 py-1">Doctores, Deportes, Comer Bien / Saludable, Cuidados Personales, Masajes</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1">Mental</td>
                                    <td class="border border-gray-300 px-2 py-1">Meditación, Vacaciones, Asesor Profesional, Lecturas & Audios de reflexión</td>
                                </tr>
                                
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1 font-semibold bg-green-50" rowspan="6">Relaciones</td>
                                    <td class="border border-gray-300 px-2 py-1">Yo</td>
                                    <td class="border border-gray-300 px-2 py-1">Autocontrol, Valores, Límites, Adicciones (Sexo, Alcohol, Cigarro, Drogas, etc.), Habilidades, Capacidades</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1">Familia</td>
                                    <td class="border border-gray-300 px-2 py-1">Hijos, Papas, Abuelos, Hermanos, Primos, Tíos, Padrinos & Madrinas<br><em class="text-gray-600">* Cualquier grado de consanguinidad</em></td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1">Amor</td>
                                    <td class="border border-gray-300 px-2 py-1">Noviazgo, Comprometidos, Casados, Divorciados, Separados, Viudos</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1">Amigos</td>
                                    <td class="border border-gray-300 px-2 py-1">Colegio, Vecindario, Fiestas, Trabajo, Universidad, Hobbies, Iglesia</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1">Conocidos</td>
                                    <td class="border border-gray-300 px-2 py-1">Compañeros de trabajo, Chofer, Señora de limpieza, Jardinero, Policía de la garita<br><em class="text-gray-600">* Los que veo, dirijo la palabra, saludo y/o me atienden</em></td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1">Desconocidos</td>
                                    <td class="border border-gray-300 px-2 py-1">Persona que va caminando en la calle, Policía de Transito, Bomberos<br><em class="text-gray-600">* Los que veo pero no dirijo la palabra</em></td>
                                </tr>
                                
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1 font-semibold bg-yellow-50" rowspan="5">Vocación</td>
                                    <td class="border border-gray-300 px-2 py-1">Estudios</td>
                                    <td class="border border-gray-300 px-2 py-1">Preparación Académica (Colegio, U, Maestría, etc.), Catedrático, Cursos</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1">Hobbies</td>
                                    <td class="border border-gray-300 px-2 py-1">Servicio Social, Cocinar, Moto, Volcán, Turismo, Entretenimiento, Evento Social, Coser, Pintar, Música, Bailar, Escribir, Cantar, Fotografía</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1">Trabajo - Personal</td>
                                    <td class="border border-gray-300 px-2 py-1">Empresas Familiares, Nuevos Negocios, Negocios Actuales<br><em class="text-gray-600">* Empresas donde laboro y soy dueño</em></td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1">Trabajo - Tercero</td>
                                    <td class="border border-gray-300 px-2 py-1">Empresas Familiares, Empresas Terceras<br><em class="text-gray-600">* Empresas donde laboro y no soy dueño</em></td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1">Material & Servicio</td>
                                    <td class="border border-gray-300 px-2 py-1">Económico, Regalos propios, Regalos terceros</td>
                                </tr>
                                
                                <tr>
                                    <td class="border border-gray-300 px-2 py-1 font-semibold bg-purple-50">Espiritual</td>
                                    <td class="border border-gray-300 px-2 py-1">Espiritual</td>
                                    <td class="border border-gray-300 px-2 py-1">Católica, Evangélica, Ateo, Musulmán<br><em class="text-gray-600">* Puede ser o no practicante</em></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `}
        >
            <InformationIcon styleTw="size-4" />
        </Tooltip>
    </div>
    
    {#if isLoading}
        <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-alineados-blue-900"></div>
            <span class="ml-2 text-gray-600">Cargando elementos...</span>
        </div>
    {:else}
        <div class="-ml-10 mt-5 flex flex-col gap-2">
            {#each elements as element}
                <Item
                    deleteItem={() => removeElement(element.id)}
                    addItem={() => addElement(element.id)}
                    prominentItem={() => toggleProminent(element.id)}
                    dailyItem={() => toggleDaily(element.id)}
                    onInput={() => {
                        // Si el usuario comienza a escribir en el último elemento, agregar uno nuevo
                        if (element.description !== '' && element.id === elements[elements.length - 1].id) {
                            addElement(element.id);
                        }
                        // Solo manejar la eliminación de elementos vacíos que no sean el último
                        if (element.description === '' && element.id !== elements[elements.length - 1].id) {
                            removeElement(element.id);
                        }
                    }}
                    onBlur={handleBlur}
                    bind:isOnlyText
                    bind:isDaily={element.daily}
                    bind:isStarred={element.prominent}
                    bind:value={element.description}
                    animate={elements.length === 1 && elements[0].description === ''}
                />
            {/each}
        </div>
    {/if}
</div>