<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
  
	export let data: PageData;
  
	// La información detallada de la categoría (CategoryInfo) se recibe en data.categoryInfo.
	// pillar es el tipo de pilar ("health", "relational", etc.)
	let categoryInfo = data.categoryInfo;
	let pillar = data.pillar;
  </script>
  
  {#if !categoryInfo}
	<p>Cargando información de la categoría...</p>
  {:else}
	<div class="p-6">
	  <h1 class="text-2xl font-bold mb-4">Editar Información de Categoría: {categoryInfo.cid}</h1>
	  <form method="POST" action="?/save">
		<!-- Campos ocultos -->
		<input type="hidden" name="id" value={categoryInfo.id} />
		<input type="hidden" name="cid" value={categoryInfo.cid} />
  
		<!-- Ejemplo: Sección de Elementos -->
		<div class="mb-4">
		  <h2 class="text-xl font-semibold mb-2">Elementos</h2>
		  <!-- Para simplificar, mostramos un textarea que contenga el JSON del array -->
		  <textarea name="elements" rows="4" class="w-full border p-2">
			{JSON.stringify(categoryInfo.elements, null, 2)}
		  </textarea>
		</div>
  
		<!-- Puedes repetir para objectives, positive_actions, etc. -->
		<div class="mb-4">
		  <h2 class="text-xl font-semibold mb-2">Objetivos</h2>
		  <textarea name="objectives" rows="4" class="w-full border p-2">
			{JSON.stringify(categoryInfo.objectives, null, 2)}
		  </textarea>
		</div>
  
		<!-- Botón para enviar -->
		<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
		  Guardar
		</button>
	  </form>
	</div>
  {/if}