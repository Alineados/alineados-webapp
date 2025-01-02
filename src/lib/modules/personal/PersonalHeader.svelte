<script lang="ts">

	import { onMount, type Snippet } from 'svelte';

  let {
    header,
    statistics,
    filter
  }: {
    header: Snippet
    statistics: Snippet
    filter: Snippet
  } = $props();

	let headerRef = $state<HTMLElement>();
	let cardContainerRef = $state<HTMLElement>();
	let filterRef = $state<HTMLElement>();
	onMount(() => {
		// const headerHeight = headerRef ? headerRef.offsetHeight : 0;
		// const problemsFilterHeight = problemsFilterRef ? problemsFilterRef.offsetHeight : 0;
		// if (problemsFilterRef) problemsFilterRef.style.top = `${headerHeight}px`;
		// if (asideProblemRef) asideProblemRef.style.top = `${headerHeight}px`;
		// if (accountabilityBodyRef)
		// 	accountabilityBodyRef.style.top = `${headerHeight + problemsFilterHeight}px`;
	});
</script>

<div bind:this={headerRef} class="sticky top-0 z-10 bg-white pb-7">
	{@render header()}
</div>

<div bind:this={cardContainerRef} class="sticky z-10 w-full bg-white pb-5">
	<div class="mx-auto flex w-6/12 flex-row gap-8">
    {@render statistics()}
	</div>
</div>

<div bind:this={filterRef} class="sticky z-10 bg-white">
  {@render filter()}
</div>
