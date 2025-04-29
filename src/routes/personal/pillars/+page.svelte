<script lang="ts">
  import { onMount } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import PillarHeader from '$lib/modules/dashboard/Pillars/PillarHeader.svelte';
  import PillarCard from '$lib/modules/dashboard/Pillars/PillarCard.svelte';
  import type { PageData } from './$types';

  // Importa los stores derivados para cada grupo
  import {
    initPillars,
    healthCategoriesFiltered,
    relationalCategoriesFiltered,
    vocationalCategoriesFiltered,
    spiritualCategoriesFiltered
  } from '$lib/stores/pillar/card';

  // Iconos para categorías
  import Weight from '$lib/icons/Weight.svelte';
  import Brain from '$lib/icons/Brain.svelte';
  import Myself from '$lib/icons/Myself.svelte';
  import Family from '$lib/icons/Family.svelte';
  import Heart from '$lib/icons/Heart.svelte';
  import Friends from '$lib/icons/Friends.svelte';
  import Known from '$lib/icons/Known.svelte';
  import Unknown from '$lib/icons/Unknown.svelte';
  import Book from '$lib/icons/Book.svelte';
  import ArtBrush from '$lib/icons/ArtBrush.svelte';
  import SelfWork from '$lib/icons/SelfWork.svelte';
  import Work from '$lib/icons/Work.svelte';
  import Spiritual from '$lib/icons/Spiritual.svelte';

  // Mapeo de íconos según el label de la categoría
  const iconMapping = {
    'Física': Weight,
    'Mental': Brain,
    'Propias': Myself,
    'Familiar': Family,
    'Amorosa': Heart,
    'Amigos': Friends,
    'Conocidos': Known,
    'Desconocidos': Unknown,
    'Estudios': Book,
    'Pasatiempos': ArtBrush,
    'Trabajo Propio': SelfWork,
    'Trabajo de Terceros': Work,
    'Bienes Materiales': Heart,
    'Espiritual': Spiritual,
  };

  function getIconForCategory(categoryName: string) {
    return iconMapping[categoryName] || Brain;
  }

  export let data: PageData;

  // Inicializa los stores con la data recibida desde el load
  $: initPillars(data.pillars);

  onMount(() => {
    invalidateAll();
  });
</script>

<div class="sticky top-0 z-10 w-full bg-white px-4 md:px-8 lg:px-16">
  <PillarHeader />
</div>

<div class="flex flex-col gap-8 px-4 md:px-8 lg:px-16">
  <!-- SALUD -->
  <h2 class="text-xl font-semibold">Salud</h2>
  <div class="flex gap-12">
    {#each $healthCategoriesFiltered as cat}
      <PillarCard
        icon={getIconForCategory(cat.label)}
        categoryName={cat.label}
        isActive={cat.active}
        priorityLevel={cat.priority || 0}
        stateLevel={cat.state || 0}
        isProtected={cat.security || false}
        pillarType="health"
      />
    {/each}
  </div>

  <!-- RELACIONES -->
  <h2 class="text-xl font-semibold">Relaciones</h2>
  <div class="flex flex-wrap gap-12">
    {#each $relationalCategoriesFiltered as cat}
      <PillarCard
        icon={getIconForCategory(cat.label)}
        categoryName={cat.label}
        isActive={cat.active}
        priorityLevel={cat.priority || 0}
        stateLevel={cat.state || 0}
        isProtected={cat.security || false}
        pillarType="relational"
      />
    {/each}
  </div>

  <!-- VOCACIÓN -->
  <h2 class="text-xl font-semibold">Vocación</h2>
  <div class="flex flex-wrap gap-12">
    {#each $vocationalCategoriesFiltered as cat}
      <PillarCard
        icon={getIconForCategory(cat.label)}
        categoryName={cat.label}
        isActive={cat.active}
        priorityLevel={cat.priority || 0}
        stateLevel={cat.state || 0}
        isProtected={cat.security || false}
        pillarType="vocational"
      />
    {/each}
  </div>

  <!-- ESPIRITUAL -->
  <h2 class="text-xl font-semibold">Espiritual</h2>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each $spiritualCategoriesFiltered as cat}
      <PillarCard
        icon={getIconForCategory(cat.label)}
        categoryName={cat.label}
        isActive={cat.active}
        priorityLevel={cat.priority || 0}
        stateLevel={cat.state || 0}
        isProtected={cat.security || false}
        pillarType="spiritual"
      />
    {/each}
  </div>
</div>
