<script lang="ts">
  import { onMount } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import PillarHeader from '$lib/modules/dashboard/Pillars/PillarHeader.svelte';
  import PillarCard from '$lib/modules/dashboard/Pillars/PillarCard.svelte';
  import type { PageData } from './$types';

  // Importamos los íconos que usaremos
  import HappyFace from '$lib/icons/HappyFace.svelte';
  import MedFace from '$lib/icons/MedFace.svelte';
  import SadFace from '$lib/icons/SadFace.svelte';

  import Stars1 from '$lib/icons/Stars1.svelte';
  import Stars2 from '$lib/icons/Stars2.svelte';
  import Stars3 from '$lib/icons/Stars3.svelte';

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
  // import MaterialGoods from '$lib/icons/MaterialGoods.svelte';
  import Spiritual from '$lib/icons/Spiritual.svelte';

  import Padlock from '$lib/icons/Padlock.svelte';


  const iconMapping = {
    Física: Weight,
    Mental: Brain,

    Propias: Myself,
    Familiar: Family,
    Amorosa: Heart,
    Amigos: Friends,
    Conocidos: Known,
    Desconocidos: Unknown,

    Estudios: Book,
    Pasatiempos: ArtBrush,
    "Trabajo Propio" : SelfWork,
    "Trabajo de Terceros": Work,
    "Bienes Materiales": Heart,

    Espiritual: Spiritual,
  };

  // Función que devuelve el ícono correspondiente para una categoría
  function getIconForCategory(categoryName: string) {
    return iconMapping[categoryName] || Brain; // Brain es el default
  }

  export let data: PageData;

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
  <!-- <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> -->
  <div class="flex gap-12">
    {#each data.pillars.health.categories as cat}
      {console.log(cat)}
      <PillarCard
        icon={getIconForCategory(cat.label)}
        categoryName={cat.label}
        isActive={cat.active}
        priorityLevel={cat.priority || 0}
        isProtected={cat.isProtected || false}
      />
    {/each}
  </div>

  <!-- RELACIONES -->
  <h2 class="text-xl font-semibold">Relaciones</h2>
  <div class="flex flex-wrap w-full gap-12">
    {#each data.pillars.relational.categories as cat}
      <PillarCard
        icon={getIconForCategory(cat.label)}
        categoryName={cat.label}
        isActive={cat.active}
      />
    {/each}
  </div>

  <!-- VOCACIÓN -->
  <h2 class="text-xl font-semibold">Vocación</h2>
  <div class="flex flex-wrap w-full gap-12">
    {#each data.pillars.vocational.categories as cat}
      <PillarCard
        icon={getIconForCategory(cat.label)}
        categoryName={cat.label}
        isActive={cat.active}
      />
    {/each}
  </div>

  <!-- ESPIRITUAL -->
  <h2 class="text-xl font-semibold">Espiritual</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each data.pillars.spiritual.categories as cat}
      <PillarCard
        icon={getIconForCategory(cat.label)}
        categoryName={cat.label}
        isActive={cat.active}
      />
    {/each}
  </div>
</div>
