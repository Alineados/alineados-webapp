<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let {
		header,
		statistics,
		filter,
		simple = false
	}: {
		header: Snippet;
		statistics: Snippet;
		filter: Snippet;
		simple?: boolean;
	} = $props();

	let headerRef = $state<HTMLElement>();
	let cardContainerRef = $state<HTMLElement>();
	let filterRef = $state<HTMLElement>();
	onMount(() => {
		const headerHeight = headerRef ? headerRef.offsetHeight : 0;
		const problemsFilterHeight = filterRef ? filterRef.offsetHeight : 0;
		if (filterRef) filterRef.style.top = `${headerHeight}px`;
		if (cardContainerRef) cardContainerRef.style.top = `${headerHeight + problemsFilterHeight}px`;
	});
</script>

<div bind:this={headerRef} class="sticky top-0 z-20 bg-white">
	{@render header()}
</div>

{#if !simple}
	<div bind:this={cardContainerRef} class="sticky z-20 flex w-full flex-col gap-9 bg-white pb-5">
		<div class="mx-auto flex w-6/12 flex-row gap-8">
			{@render statistics()}
		</div>
		<div>
			{@render filter()}
		</div>
	</div>
{/if}
<!-- 
<div bind:this={filterRef} class="sticky z-20 w-full bg-white"></div> -->
