<script lang="ts">
	import * as Dialog from '$lib/shared/ui/dialog/index.js';
</script>

<Dialog.Description class="space-y-4">
  <ol class="list-decimal space-y-4 pl-5">
    <li class="font-medium">
      Indicar la importancia de cada objetivo:
      <div class="ml-4 mt-1">
        <span class="mr-2 rounded-md bg-red-100 px-2 py-1">Alto</span>
        <span class="mr-2 rounded-md bg-yellow-100 px-2 py-1">Medio</span>
        <span class="mr-2 rounded-md bg-green-100 px-2 py-1">Bajo</span>
        <span class="rounded-md bg-blue-100 px-2 py-1">Etc...</span>
      </div>
    </li>
    <li class="font-medium">
      Colocar la unidad de medida (UOM) de cada objetivo:
      <ul class="ml-4 mt-1 space-y-2">
        <li>
          <span class="font-semibold text-blue-600">Variables cuantitativas:</span>
          <span class="italic">Unidades, metros, libras, cantidad sonrisas, etc.</span>
        </li>
        <li>
          <span class="font-semibold text-purple-600">Variables cualitativas:</span>
          <span class="italic">Colores, sentimiento, calidad, tiempo calidad, etc.</span>
        </li>
      </ul>
    </li>
    <li class="font-medium">
      Colocar el resultado de la unidad de medida:
      <ul class="ml-4 mt-1 list-disc space-y-1">
        <li>Hacerlo en cada objetivo hasta que estén completos</li>
        <li>Cada UOM tiene diferente color por cada objetivo</li>
      </ul>
    </li>
    <li class="font-medium">
      Ranquear 1-2-3 acorde el resultado del UOM:
      <div class="ml-4 mt-1 space-y-2">
        <div class="rounded-md bg-gray-100 p-2">
          <span class="font-bold">Significado de Números:</span>
          <div class="mt-1 grid grid-cols-3 gap-2">
            <div>1 – Peor</div>
            <div>2 – Intermedio</div>
            <div>3 – Mejor</div>
          </div>
        </div>
        <ul class="list-disc space-y-1 ">
          <li>Se realiza por objetivo; no por alternativa</li>
          <li>No pueden haber números repetidos en objetivos</li>
        </ul>
      </div>
    </li>
  </ol>
  <div class="mt-4 flex items-center rounded-lg bg-yellow-100 p-3">

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 text-alineados-green-900">
      <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
    </svg>      
    <span class="ml-2 font-medium text-yellow-700">
      Aparece la estrella verde a la alternativa ganadora con mayor puntos
    </span>
  </div>
</Dialog.Description>