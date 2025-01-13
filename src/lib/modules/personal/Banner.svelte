<script lang="ts">
	import Upload from '$lib/icons/Upload.svelte';

	let {
		imageURL,
		alt,
		edit
	}: {
		imageURL: string;
		alt: string;
		edit: boolean;
	} = $props();

	let isHovered = $state(false);

	function handleMouseEnter() {
		isHovered = true;
	}

	function handleMouseLeave() {
		isHovered = false;
	}
</script>

<div class="relative max-w-full">
	<div
		class="relative aspect-[5/1] w-full overflow-hidden rounded-2xl"
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		role="img"
		aria-label={alt}
	>
		<img src={imageURL} {alt} class="h-full w-full object-cover object-center" />
	</div>

	{#if edit}
		<Upload
			changeIcon={true}
			styles="absolute right-14 top-8 transform rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
			styleTw="size-9"
		/>
	{/if}
</div>
